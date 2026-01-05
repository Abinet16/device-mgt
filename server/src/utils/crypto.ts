import crypto from "crypto";
export const randomId = () => crypto.randomUUID();
export const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");