import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { auditController } from "../controllers/auditController";

const router = Router();
router.use(authenticate);
router.get("/", auditController.list);

export default router;
