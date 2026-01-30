import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { deviceController } from "../controllers/deviceController";
import { z } from "zod";
import { validate } from "../middleware/validate";
import type { Server as SocketIOServer } from "socket.io";

export default function devicesRouter(io: SocketIOServer) {
  const router = Router();
  const ctl = deviceController(io);

  const createSchema = z.object({
    name: z.string().min(2),
    serialNumber: z.string().min(3),
    platform: z.enum(["WINDOWS","MACOS","LINUX","ANDROID","IOS"]),
    tags: z.record(z.any(), z.string()).optional()
  });

  const statusSchema = z.object({
    status: z.enum(["ONLINE","OFFLINE","DECOMMISSIONED","MAINTENANCE"]).optional(),
    heartbeat: z.boolean().optional()
  });

  router.use(authenticate);

  router.get("/", ctl.list);
  router.post("/", requireRole("ADMIN","MANAGER"), validate(createSchema), ctl.create);
  router.post("/:id/enroll", ctl.enroll);
  router.patch("/:id/status", validate(statusSchema), ctl.updateStatus);
  router.delete("/:id", requireRole("ADMIN"), ctl.delete);

  return router;
}
