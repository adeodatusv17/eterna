import { FastifyInstance } from "fastify";
import { fetchAndCache } from "../services/aggregator";
import { Token } from "../types/token";
import { filterByPeriod, sortTokens, Period, SortKey } from "../utils/filterSort";
import { paginate } from "../utils/pagination";

export default async function tokenRoutes(app: FastifyInstance) {
  app.get("/tokens", async (req, reply) => {
    try {
      const query = req.query as any;

      const q: string = query.q || "SOL";
      const limit: number = Math.min(Number(query.limit || 25), 100);
      const cursor: string | undefined = query.cursor;

      const period: Period | undefined = query.period;
      const sort: SortKey | undefined = query.sort;
      const order: "asc" | "desc" = query.order === "asc" ? "asc" : "desc";

      // 1. Fetch merged + cached list
      const list = await fetchAndCache(q);

      // 2. Filter by time range (1h / 24h / 7d)
      const filtered = filterByPeriod(list, period);

      // 3. Sort safely by allowed keys
      const sorted = sortTokens(filtered, sort, order);

      // 4. Cursor-based pagination
      const { items, nextCursor } = paginate(sorted, limit, cursor);

      return reply.send({
        data: items,
        nextCursor,
        count: items.length,
        updatedAt: Date.now(),
      });

    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ error: "Failed to fetch tokens" });
    }
  });
}
