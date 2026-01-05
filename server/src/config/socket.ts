import { Server as SocketIOServer } from "socket.io";
import { env } from "./env";

export function createSocket(server: any) {
  const io = new SocketIOServer(server, {
    cors: { origin: env.SOCKET_ALLOWED_ORIGINS },
  });

  io.on("connection", (socket) => {
    socket.on("join_org", (orgId: string) => socket.join(`org:${orgId}`));
    socket.on("disconnect", () => {});
  });

  return io;
}
