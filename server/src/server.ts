import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import http from "http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import policiesRouter from "./routes/policies";
import auditsRouter from "./routes/audits";
import devicesRouter from "./routes/devices";
import { createSocket } from "./config/socket";
import  {startHeartbeatMonitor} from "./jobs/heartbeatMonitor";

const app = express();
const server = http.createServer(app);
const io = createSocket(server);

// Security and middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging with structured format
app.use(morgan("combined", {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    }
  }
}));

// Health check endpoint
app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "1.0.0"
  });
});

// API routes with versioning
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/policies", policiesRouter);
app.use("/api/v1/audits", auditsRouter);
app.use("/api/v1/devices", devicesRouter(io));

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error({ error: error.message, stack: error.stack }, 'Uncaught Exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error({ reason }, 'Unhandled Rejection');
  process.exit(1);
});

server.listen(env.PORT, () => {
  logger.info(`API listening on ${env.PORT}`);
  startHeartbeatMonitor(io); // schedule offline detection
});