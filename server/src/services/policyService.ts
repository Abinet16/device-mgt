import { policyRepo } from "../repositories/policyRepo";
import { auditRepo } from "../repositories/auditRepo";

export const policyService = {
  list: (orgId: string) => policyRepo.listByOrg(orgId),
  create: async (orgId: string, userId: string, name: string, config: any) => {
    const policy = await policyRepo.create({ orgId, name, config });
    await auditRepo.log({
      orgId,
      userId,
      category: "POLICY",
      action: "CREATE",
      detail: { name },
    });
    return policy;
  },
  update: async (
    id: string,
    orgId: string,
    userId: string,
    data: { name?: string; config?: any }
  ) => {
    const policy = await policyRepo.update(id, data);
    if (policy.orgId !== orgId)
      throw Object.assign(new Error("Forbidden"), {
        status: 403,
        code: "POLICY_FORBIDDEN",
      });
    await auditRepo.log({
      orgId,
      userId,
      category: "POLICY",
      action: "UPDATE",
      detail: { id },
    });
    return policy;
  },
  delete: async (id: string, orgId: string, userId: string) => {
    await policyRepo.delete(id);
    await auditRepo.log({
      orgId,
      userId,
      category: "POLICY",
      action: "DELETE",
      detail: { id },
    });
  },
  assignToDevice: async (
    deviceId: string,
    orgId: string,
    policyId: string | null,
    userId: string
  ) => {
    const updatedDevice = await policyRepo.assignToDevice(deviceId, policyId);
    await auditRepo.log({
      orgId,
      userId,
      deviceId,
      category: "POLICY",
      action: "ASSIGN",
      detail: { policyId },
    });
    return updatedDevice;
  },
};
