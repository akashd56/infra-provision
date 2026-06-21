import { Router } from "express";
import { pool } from "../../db.js";
import { QUEUE_NAME, getChannel } from "../../lib/rabbitmq.js";
import { docker } from "../../lib/docker/docker.js";

const healthCheckRouter: Router = Router();

healthCheckRouter.get("/health", async (_req, res) => {
  let database: "down" | "up" = "down";
  let rabbitmq: "down" | "up" = "down";
  let dockerStatus: "down" | "up" = "down";

  try {
    await pool.query("select 1");
    database = "up";
  } catch {}

  try {
    const channel = await getChannel();

    await channel.checkQueue(QUEUE_NAME);

    rabbitmq = "up";
  } catch {}

  try {
    await docker.version();

    dockerStatus = "up";
  } catch {}

  const isHealthy =
    database === "up" && rabbitmq === "up" && dockerStatus === "up";

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    database,
    rabbitmq,
    docker: dockerStatus,
  });
});

export { healthCheckRouter };
