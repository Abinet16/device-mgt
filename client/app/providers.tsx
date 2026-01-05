"use client";
import { AuthProvider } from "./providers/auth-provider";
import { SocketProvider } from "./providers/socket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const orgId = "default-org"; // parse from JWT in real app
  return (
    <AuthProvider>
      <SocketProvider orgId={orgId}>{children}</SocketProvider>
    </AuthProvider>
  );
}
