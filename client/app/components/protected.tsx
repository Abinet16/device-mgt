"use client";
import { useAuth } from "../providers/auth-provider";
import { useEffect, useState } from "react";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token) window.location.href = "/login";
    else setLoading(false);
  }, [token]);
  if (loading) return <div className="p-6">Checking authentication...</div>;
  return <>{children}</>;
}
