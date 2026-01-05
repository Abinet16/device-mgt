import { Request, Response } from "express";
import { auditService } from "../services/auditService";

export const auditController = {
  list: async (req: Request, res: Response) => {
    const { orgId } = (req as any).user;
    const audits = await auditService.listByOrg(orgId);
    res.json(audits);
  },
};
