import "./globals.css";
import { Inter } from "next/font/google";
import { ApiHealthIndicator } from "./components/api-health-indicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DeviceManager | Secure Enterprise Control",
  description: "Manage devices, policies, and audits seamlessly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
        <ApiHealthIndicator />
      </body>
    </html>
  );
}
