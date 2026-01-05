import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  const code = err.code ?? "INTERNAL_ERROR";
  logger.error({ err, path: req.path, code }, err.message);
  res.status(status).json({ error: { code, message: err.message ?? "Internal Server Error" } });
}