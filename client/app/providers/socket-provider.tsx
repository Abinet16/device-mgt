"use client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-provider";

const SocketCtx = createContext<Socket | null>(null);

export function SocketProvider({
  orgId,
  children,
}: {
  orgId: string;
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        auth: { token },
        transports: ["websocket"],
      }),
    [token]
  );

  useEffect(() => {
    socket.emit("join_org", orgId);
    return () => socket.disconnect();
  }, [socket, orgId]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}

export function useSocket() {
  const s = useContext(SocketCtx);
  if (!s) throw new Error("Socket not initialized");
  return s;
}
