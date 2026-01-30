import { DeviceStatus } from "@prisma/client";
import { deviceRepo } from "../repositories/deviceRepo";
import { auditRepo } from "../repositories/auditRepo";
import { randomId } from "../utils/crypto";

export const deviceService = {
  list: (orgId: string) => deviceRepo.listByOrg(orgId),

  create: async (
    orgId: string,
    userId: string,
    data: {
      name: string;
      serialNumber: string;
      platform: "WINDOWS" | "MACOS" | "LINUX" | "ANDROID" | "IOS";
      tags?: Record<string, any>;
    }
  ) => {
    const device = await deviceRepo.create({
      ...data,
      orgId,
      registeredById: userId,
      enrollmentToken: randomId(),
      status: "OFFLINE",
    });
    await auditRepo.log({
      orgId,
      deviceId: device.id,
      userId,
      category: "DEVICE",
      action: "CREATE",
      detail: { name: data.name },
    });
    return device;
  },

  enroll: async (id: string, token: string, orgId: string) => {
    const device = await deviceRepo.findById(id);
    if (!device || device.enrollmentToken !== token || device.orgId !== orgId)
      throw Object.assign(new Error("Invalid token"), {
        status: 400,
        code: "INVALID_ENROLLMENT",
      });

    const updated = await deviceRepo.update(id, {
      status: "ONLINE",
      lastHeartbeat: new Date(),
    });
    await auditRepo.log({
      orgId,
      deviceId: id,
      category: "DEVICE",
      action: "ENROLL",
    });
    return updated;
  },

  updateStatus: async (
    id: string,
    orgId: string,
    status?: DeviceStatus,
    heartbeat?: boolean
  ) => {
    const device = await deviceRepo.findById(id);
    if (!device || device.orgId !== orgId)
      throw Object.assign(new Error("Not found"), {
        status: 404,
        code: "DEVICE_NOT_FOUND",
      });

    const updated = await deviceRepo.update(id, {
      status: status ?? device.status,
      lastHeartbeat: heartbeat ? new Date() : device.lastHeartbeat ?? new Date(0),
    });
    await auditRepo.log({
      orgId,
      deviceId: id,
      category: "DEVICE",
      action: "STATUS_UPDATE",
      detail: { status: updated.status, heartbeat: !!heartbeat },
    });
    return updated;
  },

  delete: async (id: string, orgId: string, userId: string) => {
    const device = await deviceRepo.findById(id);
    if (!device || device.orgId !== orgId)
      throw Object.assign(new Error("Not found"), {
        status: 404,
        code: "DEVICE_NOT_FOUND",
      });
    await deviceRepo.delete(id);
    await auditRepo.log({
      orgId,
      deviceId: id,
      userId,
      category: "DEVICE",
      action: "DELETE",
    });
  },
};
