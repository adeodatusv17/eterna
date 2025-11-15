import Fastify from "fastify";
import cors from "@fastify/cors";
import tokenRoutes from "./api/tokens";
import { setupSocketIO } from "./websocket/ws";
import { logger } from "./utils/logger";

export function buildServer() {
  const fastify = Fastify({ logger:true });
  fastify.register(cors, { origin: true });

  fastify.get("/health", async () => ({ ok: true }));
  fastify.register(tokenRoutes, { prefix: "/api" });

  return fastify;
}

export async function start() {
  const fastify = buildServer();
  const port = Number(process.env.PORT || 3000);

  await fastify.listen({ port, host: "0.0.0.0" });

  // Attach WebSocket server
  // @ts-ignore
  setupSocketIO((fastify as any).server);

  console.log("Server running at http://localhost:" + port);
}
