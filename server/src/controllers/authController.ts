import { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);
    res.json(tokens);
  },
  refresh: async (req: Request, res: Response) => {
    const { token } = req.body;
    const access = await authService.refresh(token);
    res.json(access);
  },
};
