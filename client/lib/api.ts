import { useAuth } from "../app/providers/auth-provider";

export function useApi() {
  const { token } = useAuth();
  return async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
}
