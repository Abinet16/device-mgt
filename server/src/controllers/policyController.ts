import { Request, Response } from "express";
import { policyService } from "../services/policyService";

export const policyController = {
  list: async (req: Request, res: Response) => {
    const { orgId } = (req as any).user;
    const policies = await policyService.list(orgId);
    res.json(policies);
  },
  create: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const { name, config } = (req as any).parsed;
    const policy = await policyService.create(orgId, userId, name, config);
    res.status(201).json(policy);
  },
  update: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const { id } = req.params;
    const policy = await policyService.update(
      id,
      orgId,
      userId,
      (req as any).parsed
    );
    res.json(policy);
  },
  delete: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const { id } = req.params;
    await policyService.delete(id, orgId, userId);
    res.status(204).send();
  },
  assignToDevice: async (req: Request, res: Response) => {
    const { orgId, userId } = (req as any).user;
    const { deviceId } = req.params;
    const { policyId } = (req as any).parsed;
    const device = await policyService.assignToDevice(
      deviceId,
      orgId,
      policyId,
      userId
    );
    res.json(device);
  },
};
