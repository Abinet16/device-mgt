"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/auth-provider";
import {
  Smartphone,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) router.push("/dashboard");
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message || "Invalid credentials. Please try again."
        );
      }

      const { access } = await res.json();
      localStorage.setItem("access", access);
      setToken(access);

      // Use router.push for a smoother SPA transition than window.location
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white py-10 px-6 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-12">
      {/* Brand Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-indigo-600 p-2.5 rounded-xl mb-4 shadow-indigo-200 shadow-lg">
          <Smartphone className="text-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Enter your credentials to access your fleet.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <a
              href="#"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Contact Admin
          </a>
        </p>
      </div>
    </div>
  );
}
