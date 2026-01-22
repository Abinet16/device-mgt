import dotenv from "dotenv";
dotenv.config();


function required(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  FRONTEND_URL: required("FRONTEND_URL"),
  SOCKET_ALLOWED_ORIGINS: (process.env.SOCKET_ALLOWED_ORIGINS ?? "*").split(","),
  HEARTBEAT_GRACE_MINUTES: Number(process.env.HEARTBEAT_GRACE_MINUTES ?? 5)
};