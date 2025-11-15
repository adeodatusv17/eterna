import { Server as SocketIOServer } from "socket.io";
import { forceRefresh } from "../services/aggregator";
import { getCache } from "../cache/redisClient";
import { Token } from "../types/token";

export function setupSocketIO(server: any) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
    path: "/socket.io"
  });

  io.on("connection", socket => {
  console.log("WS connected:", socket.id);
  
  socket.join("TOKENS");

  socket.emit("subscribed", "TOKENS");
});


setInterval(async () => {
  await forceRefresh("SOL");

  const data = await getCache<Token[]>("tokens:list") || [];

  console.log("[WS] Broadcasting update:", data.length, "tokens");

  io.to("TOKENS").emit("tokens:update", {
    ts: Date.now(),
    data,
  });
}, Number(process.env.REFRESH_INTERVAL_MS || 5000));


  return io;
}
