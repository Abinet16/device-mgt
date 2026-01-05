// app/providers.tsx
"use client";
import { AuthProvider } from "./providers/auth-provider";
import { SocketProvider } from "./providers/socket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const orgId = "default-org"; // Replace with actual org from JWT
  return (
    <AuthProvider>
      <SocketProvider orgId={orgId}>{children}</SocketProvider>
    </AuthProvider>
  );
}
