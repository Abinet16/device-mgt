import { deviceRepo } from "../repositories/deviceRepo";
import { env } from "../config/env";
import { minutesAgo } from "../utils/time";
import type { Server as SocketIOServer } from "socket.io";
import { logger } from "../utils/logger";

export function startHeartbeatMonitor(io: SocketIOServer) {
  const intervalMs = 60 * 1000; // every minute
  setInterval(async () => {
    try {
      const cutoff = minutesAgo(env.HEARTBEAT_GRACE_MINUTES);
      const result = await deviceRepo.markOfflineOlderThan(cutoff);
      if ((result as any).count > 0) {
        logger.info(
          { offlineCount: (result as any).count },
          "Devices marked OFFLINE"
        );
        // Optional: broadcast a generic event per org if needed.
      }
    } catch (err: any) {
      logger.error({ err }, "Heartbeat monitor error");
    }
  }, intervalMs);
}
