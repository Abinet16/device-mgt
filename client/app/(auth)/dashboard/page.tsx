// app/dashboard/page.tsx
"use client";
import Protected from "../../components/protected";
import { useEffect, useState } from "react";
import { useApi } from "../../../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ devices: 0, policies: 0, audits: 0 });
  const api = useApi();

  useEffect(() => {
    Promise.all([api("/devices"), api("/policies"), api("/audits")]).then(
      ([devices, policies, audits]) => {
        setStats({
          devices: devices.length,
          policies: policies.length,
          audits: audits.length,
        });
      }
    );
  }, []);

  return (
    <Protected>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Devices</h2>
            <p className="text-3xl">{stats.devices}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Policies</h2>
            <p className="text-3xl">{stats.policies}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Audits</h2>
            <p className="text-3xl">{stats.audits}</p>
          </div>
        </div>
      </div>
    </Protected>
  );
}
