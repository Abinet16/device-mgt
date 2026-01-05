"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../providers/auth-provider";

export default function LoginPage() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (localStorage.getItem("access")) window.location.href = "/dashboard";
  }, []);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const { access } = await res.json();
      localStorage.setItem("access", access);
      setToken(access);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  }
  return (
    <div className="bg-white shadow rounded p-6 w-96">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
