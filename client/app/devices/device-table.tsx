"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../providers/socket-provider";
import { useApi } from "../../lib/api";

type Device = {
  id: string;
  name: string;
  serialNumber: string;
  platform: string;
  status: string;
  lastHeartbeat: string | null;
};

export default function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const api = useApi();
  const socket = useSocket();

  useEffect(() => {
    api("/devices").then(setDevices);

    socket.on("device_created", (d: Device) =>
      setDevices((prev) => [d, ...prev])
    );
    socket.on("device_status", (upd: Partial<Device> & { id: string }) =>
      setDevices((prev) =>
        prev.map((d) => (d.id === upd.id ? { ...d, ...upd } : d))
      )
    );
    socket.on("device_deleted", ({ id }) =>
      setDevices((prev) => prev.filter((d) => d.id !== id))
    );

    return () => {
      socket.off("device_created");
      socket.off("device_status");
      socket.off("device_deleted");
    };
  }, [socket]);

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Serial</th>
          <th className="p-2">Platform</th>
          <th className="p-2">Status</th>
          <th className="p-2">Heartbeat</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr key={d.id} className="border-t">
            <td className="p-2">{d.name}</td>
            <td className="p-2">{d.serialNumber}</td>
            <td className="p-2">{d.platform}</td>
            <td className="p-2">{d.status}</td>
            <td className="p-2">{d.lastHeartbeat ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
