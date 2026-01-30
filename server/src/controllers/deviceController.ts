import { Request, Response } from "express";
import { deviceService } from "../services/deviceService";
import type { Server as SocketIOServer } from "socket.io";

export const deviceController = (io: SocketIOServer) => ({
  list: async (req: Request, res: Response) => {
    const { orgId } = (req as any).user;
    const devices = await deviceService.list(orgId);
    res.json(devices);
  },
  create: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const device = await deviceService.create(
      orgId,
      userId,
      (req as any).parsed
    );
    io.to(`org:${orgId}`).emit("device_created", device);
    res.status(201).json(device);
  },
  enroll: async (req: Request, res: Response) => {
    const { orgId } = (req as any).user;
    const { id } = req.params;
    const { token } = req.body;
      if (!id) {
        return res.status(400).json({ error: "device ID is required" });
      }
    const device = await deviceService.enroll(id, token, orgId);
    io.to(`org:${orgId}`).emit("device_enrolled", device);
    res.json(device);
  },
  updateStatus: async (req: Request, res: Response) => {
    const { orgId } = (req as any).user;
    const { id } = req.params;
     if (!id) {
       return res.status(400).json({ error: "Device ID is required" });
     }
    const { status, heartbeat } = (req as any).parsed;
    const updated = await deviceService.updateStatus(
      id,
      orgId,
      status,
      heartbeat
    );
    io.to(`org:${orgId}`).emit("device_status", {
      id,
      status: updated.status,
      lastHeartbeat: updated.lastHeartbeat,
    });
    res.json(updated);
  },
  delete: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const { id } = req.params;
     if (!id) {
       return res.status(400).json({ error: "Device ID is required" });
     }
    await deviceService.delete(id, orgId, userId);
    io.to(`org:${orgId}`).emit("device_deleted", { id });
    res.status(204).send();
  },
});
