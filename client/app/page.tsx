"use client";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const token = localStorage.getItem("access");
    window.location.href = token ? "/dashboard" : "/login";
  }, []);
  return <div className="p-6">Loading...</div>;
}
