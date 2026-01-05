"use client";
import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type Audit = {
  id: string;
  category: string;
  action: string;
  createdAt: string;
  detail: any;
};

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const api = useApi();

  useEffect(() => {
    api("/audits").then(setAudits);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Audit Logs</h1>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li key={a.id} className="border p-2 rounded">
            <span className="font-semibold">{a.category}</span> → {a.action}
            <div className="text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </div>
            {a.detail && (
              <pre className="bg-gray-50 p-2 mt-1 text-sm">
                {JSON.stringify(a.detail, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
