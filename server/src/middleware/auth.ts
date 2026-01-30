import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  role: "ADMIN" | "MANAGER" | "VIEWER";
  orgId: string;
};

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }
  
  try {
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }
    const payload = jwt.verify(token, jwtSecret) as unknown as JwtPayload;
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;
    if (!roles.includes(user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
