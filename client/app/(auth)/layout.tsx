import "../globals.css";
import Link from "next/link";
import { Providers } from "../providers";
import LogoutButton from "../components/logout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <div className="flex h-screen">
            <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
              <h1 className="text-2xl font-bold mb-6">Device Manager</h1>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="hover:bg-gray-100 p-2 rounded"
                >
                  Dashboard
                </Link>
                <Link href="/devices" className="hover:bg-gray-100 p-2 rounded">
                  Devices
                </Link>
                <Link
                  href="/policies"
                  className="hover:bg-gray-100 p-2 rounded"
                >
                  Policies
                </Link>
                <Link href="/audits" className="hover:bg-gray-100 p-2 rounded">
                  Audits
                </Link>
              </nav>
              <div className="mt-auto">
                <LogoutButton />
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
