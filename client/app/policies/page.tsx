"use client";
import { useEffect, useState } from "react";
import { useApi } from "../../lib/api";

type Policy = { id: string; name: string; config: any };

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const api = useApi();

  useEffect(() => {
    api("/policies").then(setPolicies);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Policies</h1>
      <ul className="space-y-2">
        {policies.map((p) => (
          <li key={p.id} className="border p-2 rounded">
            <strong>{p.name}</strong>
            <pre className="bg-gray-50 p-2 mt-1 text-sm">
              {JSON.stringify(p.config, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
