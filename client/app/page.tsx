
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  BarChart3, 
  ChevronRight, 
  Github 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Smartphone className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Device<span className="text-indigo-600">Manager</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
              <a href="/login" className="hover:text-indigo-600 transition-colors">Sign In</a>
              <a 
                href="/login" 
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                Unified Control for the <span className="text-indigo-600">Modern Enterprise</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Manage your global device fleet, enforce security policies, and 
                automate compliance audits—all from a single, intuitive dashboard.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => router.push('/login')}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-xl"
                >
                  Start Managing Now <ChevronRight className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why DeviceManager?</h2>
              <p className="mt-4 text-slate-600">Everything you need to secure your organization.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
                title="Security First"
                description="Enforce end-to-end encryption and multi-factor authentication across all managed devices."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
                title="Real-time Audits"
                description="Get instant visibility into device health, location, and compliance status with automated reporting."
              />
              <FeatureCard 
                icon={<Lock className="w-8 h-8 text-indigo-600" />}
                title="Remote Wipe"
                description="Instantly lock or wipe sensitive data from lost or stolen devices to prevent data breaches."
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <Smartphone className="w-5 h-5" />
            <span className="font-bold">DeviceManager</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DeviceManager Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}