import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const auditRepo = {
  log: (data: {
    orgId: string;
    deviceId?: string;
    userId?: string;
    category: string;
    action: string;
    detail?: any;
  }) => prisma.auditLog.create({ data }),
  listByOrg: (orgId: string) =>
    prisma.auditLog.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    }),
};
