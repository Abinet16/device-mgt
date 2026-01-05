import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepo } from "../repositories/userRepo";

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepo.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash))
      throw Object.assign(new Error("Invalid credentials"), {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });

    const access = jwt.sign(
      { userId: user.id, role: user.role, orgId: user.orgId },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refresh = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    return { access, refresh };
  },

  refresh: async (token: string) => {
    try {
      const { userId } = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        userId: string;
      };
      const user = await userRepo.findById(userId);
      if (!user) throw new Error("Invalid refresh");
      const access = jwt.sign(
        { userId: user.id, role: user.role, orgId: user.orgId },
        env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      return { access };
    } catch {
      throw Object.assign(new Error("Invalid refresh"), {
        status: 401,
        code: "INVALID_REFRESH",
      });
    }
  },
};
