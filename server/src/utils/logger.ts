import pino from "pino";

const loggerOptions: any = {
  level: process.env.LOG_LEVEL ?? "info",
};

if (process.env.NODE_ENV === "development") {
  loggerOptions.transport = { target: "pino-pretty" };
}

export const logger = pino(loggerOptions);
