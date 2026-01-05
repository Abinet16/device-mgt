import { auditRepo } from "../repositories/auditRepo";
export const auditService = {
  listByOrg: (orgId: string) => auditRepo.listByOrg(orgId),
};
