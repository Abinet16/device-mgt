import "../globals.css";
import { Providers } from "../providers";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <main className="flex min-h-screen items-center justify-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
