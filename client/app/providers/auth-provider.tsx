"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { tokenManager } from "@/lib/token-manager";

type AuthCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with stored token
    const stored = tokenManager.getAccessToken();
    if (stored) {
      setTokenState(stored);
    }
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) {
      // Store token in token manager
      tokenManager.setTokens(t);
    } else {
      tokenManager.clearTokens();
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const newToken = await tokenManager.refreshAccessToken();
      if (newToken) {
        setTokenState(newToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      setToken, 
      isAuthenticated: !!token,
      refreshToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}