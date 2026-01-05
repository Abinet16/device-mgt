import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import policiesRouter from "./routes/policies";
import auditsRouter from "./routes/audits";
import devicesRouter from "./routes/devices";
import { createSocket } from "./config/socket";
import  {startHeartbeatMonitor} from "./jobs/heartbeatMoniter";

const app = express();
const server = http.createServer(app);
const io = createSocket(server);

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRouter);
app.use("/policies", policiesRouter);
app.use("/audits", auditsRouter);
app.use("/devices", devicesRouter(io));

app.use(errorHandler);

server.listen(env.PORT, () => {
  logger.info(`API listening on ${env.PORT}`);
  startHeartbeatMonitor(io); // schedule offline detection
});