"use client";
import { useAuth } from "../providers/auth-provider";

export default function LogoutButton() {
  const { setToken } = useAuth();

  function handleLogout() {
    localStorage.removeItem("access");
    setToken(null);
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="hover:bg-gray-100 p-2 rounded w-full text-left"
    >
      Logout
    </button>
  );
}
