import { Providers } from "../providers"; // Adjust path as needed

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] bg-indigo-100/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
      </div>
    </Providers>
  );
}
