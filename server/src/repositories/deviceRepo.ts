import { PrismaClient, DeviceStatus } from "@prisma/client";
const prisma = new PrismaClient();

export const deviceRepo = {
  listByOrg: (orgId: string) =>
    prisma.device.findMany({ where: { orgId }, orderBy: { updatedAt: "desc" } }),
  create: (data: any) => prisma.device.create({ data }),
  findById: (id: string) => prisma.device.findUnique({ where: { id } }),
  update: (id: string, data: Partial<{ status: DeviceStatus; lastHeartbeat: Date; policyId: string }>) =>
    prisma.device.update({ where: { id }, data }),
  delete: (id: string) => prisma.device.delete({ where: { id } }),
  markOfflineOlderThan: (date: Date) =>
    prisma.device.updateMany({
      where: { lastHeartbeat: { lt: date }, status: { notIn: ["DECOMMISSIONED", "MAINTENANCE"] } },
      data: { status: "OFFLINE" }
    }),
};