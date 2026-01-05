import { Router } from "express";
import { authController } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimit";
import { z } from "zod";
import { validate } from "../middleware/validate";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const refreshSchema = z.object({ token: z.string().min(10) });

router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh",
  authLimiter,
  validate(refreshSchema),
  authController.refresh
);

export default router;
