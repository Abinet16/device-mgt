// app/page.tsx
"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Device Manager</h1>
        <p className="text-gray-600">
          Manage devices, policies, and audits in one place.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
          <Link href="/dashboard" className="bg-gray-200 px-4 py-2 rounded">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
