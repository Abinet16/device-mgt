"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Protected from "../../components/protected";
import { useApi } from "../../../lib/api";
import {
  Smartphone,
  ShieldCheck,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const api = useApi();

  // States
  const [stats, setStats] = useState({ devices: 0, policies: 0, audits: 0 });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devices, policies, audits] = await Promise.all([
          api("/devices"),
          api("/policies"),
          api("/audits"),
        ]);
        setStats({
          devices: devices.length,
          policies: policies.length,
          audits: audits.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    router.push("/login");
  };

  return (
    <Protected>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* --- SIDEBAR --- */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-xl">
                <Smartphone size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Device<span className="text-indigo-400">MGR</span>
              </span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              <NavItem
                icon={<LayoutDashboard size={20} />}
                label="Overview"
                active
              />
              <NavItem icon={<Smartphone size={20} />} label="My Devices" />
              <NavItem
                icon={<ShieldCheck size={20} />}
                label="Policy Control"
              />
              <NavItem icon={<ClipboardCheck size={20} />} label="Audit Logs" />
              <NavItem icon={<Settings size={20} />} label="Settings" />
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* HEADER */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-slate-600"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </button>
              <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-2xl w-80">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">System Manager</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AD
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD BODY */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dashboard Overview
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Real-time status of your device ecosystem.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                    Export Report
                  </button>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all">
                    Add New Device
                  </button>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <StatCard
                  label="Total Managed Devices"
                  value={stats.devices}
                  icon={<Smartphone className="text-indigo-600" />}
                  color="bg-indigo-50"
                  loading={loading}
                  growth="+4.2%"
                />
                <StatCard
                  label="Compliance Policies"
                  value={stats.policies}
                  icon={<ShieldCheck className="text-emerald-600" />}
                  color="bg-emerald-50"
                  loading={loading}
                  growth="Active"
                />
                <StatCard
                  label="Security Audits"
                  value={stats.audits}
                  icon={<ClipboardCheck className="text-amber-600" />}
                  color="bg-amber-50"
                  loading={loading}
                  growth="Check required"
                />
              </div>

              {/* BOTTOM SECTION: RECENT ACTIVITY & SYSTEM HEALTH */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-2">
                  <div className="p-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="text-indigo-500" size={20} />
                      Recent Activity
                    </h3>
                    <button className="text-indigo-600 text-xs font-bold hover:underline">
                      View All Activity
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                            <Smartphone size={18} className="text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              MacBook Pro M3 Pro - Registered
                            </p>
                            <p className="text-xs text-slate-500">
                              Employee: Sarah Jenkins • 14:20 PM
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health / Quick Stats */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    Device Distribution
                  </h3>
                  <div className="space-y-6">
                    <ProgressItem
                      label="iOS / iPadOS"
                      value={65}
                      color="bg-indigo-500"
                    />
                    <ProgressItem
                      label="Android Enterprise"
                      value={25}
                      color="bg-emerald-500"
                    />
                    <ProgressItem
                      label="macOS / Windows"
                      value={10}
                      color="bg-amber-500"
                    />
                  </div>
                  <div className="mt-10 p-5 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-xs text-slate-400 font-medium">
                        Security Score
                      </p>
                      <p className="text-2xl font-bold mt-1">94/100</p>
                    </div>
                    <TrendingUp className="absolute right-[-10px] bottom-[-10px] h-20 w-20 text-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
          : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
    >
      {icon}
      {label}
    </a>
  );
}

function StatCard({ label, value, icon, color, loading, growth }: any) {
  if (loading) {
    return (
      <div className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100" />
    );
  }
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} />
          {growth}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ProgressItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
