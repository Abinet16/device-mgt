import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const policyRepo = {
  listByOrg: (orgId: string) => prisma.policy.findMany({ where: { orgId } }),
  create: (data: any) => prisma.policy.create({ data }),
  update: (id: string, data: any) =>
    prisma.policy.update({ where: { id }, data }),
  delete: (id: string) => prisma.policy.delete({ where: { id } }),
  assignToDevice: (deviceId: string, policyId: string | null) =>
    prisma.device.update({ where: { id: deviceId }, data: { policyId } }),
};
