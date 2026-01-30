import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { policyController } from "../controllers/policyController";
import { z } from "zod";
import { validate } from "../middleware/validate";

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  config: z.record(z.string(), z.any()),
});
const updateSchema = z.object({
  name: z.string().min(2).optional(),
  config: z.record(z.string(), z.any()).optional(),
});
const assignSchema = z.object({ policyId: z.string().nullable() });

router.use(authenticate);

router.get("/", policyController.list);
router.post(
  "/",
  requireRole("ADMIN", "MANAGER"),
  validate(createSchema),
  policyController.create
);
router.patch(
  "/:id",
  requireRole("ADMIN", "MANAGER"),
  validate(updateSchema),
  policyController.update
);
router.delete("/:id", requireRole("ADMIN"), policyController.delete);
router.post(
  "/assign/:deviceId",
  requireRole("ADMIN", "MANAGER"),
  validate(assignSchema),
  policyController.assignToDevice
);

export default router;
