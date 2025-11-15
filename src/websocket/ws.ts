import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { forceRefresh } from "../services/aggregator";
import { getCache } from "../cache/redisClient";
import { Token } from "../types/token";

function cacheKey(query: string) {
  return `tokens:list:${query.toLowerCase()}`;
}


export function setupSocketIO(server: http.Server | any): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("WS connected:", socket.id);
    socket.join("TOKENS");
    socket.emit("subscribed", "TOKENS");

    socket.on("disconnect", () => {
      console.log("WS disconnected:", socket.id);
    });
  });

  // Configurable values (env or defaults)
  const refreshIntervalMs = Number(process.env.REFRESH_INTERVAL_MS || 5000);
  const defaultQuery = (process.env.DEFAULT_WS_QUERY || "sol").toString().toLowerCase();

  // Broadcast function with safe error handling
  const broadcast = async (query = defaultQuery) => {
    try {
      // refresh cache for this query (forceRefresh will set per-query cache if aggregator is fixed)
      await forceRefresh(query);

      // read from per-query cache key
      const key = cacheKey(query);
      const data = (await getCache<Token[]>(key)) || [];

      console.log(`[WS] Broadcasting update: ${data.length} tokens (query=${query})`);

      io.to("TOKENS").emit("tokens:update", {
        ts: Date.now(),
        query,
        data,
      });
    } catch (err: any) {
      // don't crash the interval on error
      console.error("[WS] Broadcast error:", err?.message ?? err);
    }
  };

  // Start periodic broadcasting
  const intervalId = setInterval(() => void broadcast(), refreshIntervalMs);

  // Clean-up on server shutdown (best-effort)
  const cleanup = () => {
    clearInterval(intervalId);
    try {
      io.close();
    } catch (e) {
      /* ignore */
    }
  };
  // Hook into process events so we don't leak timers in dev or server restarts
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);

  return io;
}
