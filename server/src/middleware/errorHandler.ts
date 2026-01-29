import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal Server Error";

  // Handle specific error types
  if (err instanceof ZodError) {
    status = 400;
    code = "VALIDATION_ERROR";
    message = "Invalid request data";
    
    return res.status(status).json({
      error: {
        code,
        message,
        details: err.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      }
    });
  }

  if (err.status) {
    status = err.status;
    code = err.code || "REQUEST_ERROR";
    message = err.message || "Request failed";
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    code = "TOKEN_EXPIRED";
    message = "Authentication token has expired";
  }

  // Handle Prisma errors
  if (err.code?.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        status = 409;
        code = "DUPLICATE_ENTRY";
        message = "Resource already exists";
        break;
      case 'P2025':
        status = 404;
        code = "NOT_FOUND";
        message = "Resource not found";
        break;
      default:
        status = 400;
        code = "DATABASE_ERROR";
        message = "Database operation failed";
    }
  }

  // Log error with context
  logger.error({
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code,
      status
    },
    request: {
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent')
    }
  }, `${code}: ${message}`);

  // Don't expose stack trace in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response: any = {
    error: {
      code,
      message,
      timestamp: new Date().toISOString()
    }
  };

  if (isDevelopment) {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
}