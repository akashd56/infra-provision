import { Router } from "express";
import { pool } from "../../db.js";
import { ResourceStatus } from "../../types/resource.js";
import { JobStatus, JobType } from "../../types/job.js";
import { getChannel, QUEUE_NAME } from "../../lib/rabbitmq.js";
import type { QueueMessage } from "../../types/queue.js";

const resourceRouter: Router = Router();

resourceRouter.delete("/resources/:id", async (req, res) => {
  const resourceId = req.params.id;

  if (!resourceId) throw new Error("Missing resource ID");

  const client = await pool.connect();

  try {
    await client.query("begin");

    await client.query("update load_balancers set status=$1 where id=$2", [
      ResourceStatus.DELETING,
      resourceId,
    ]);

    const jobId = crypto.randomUUID();

    await client.query(
      "insert into jobs ( id, type, payload, status) values ($1, $2, $3, $4)",
      [jobId, JobType.DELETE_LB, { resourceId }, JobStatus.PENDING],
    );

    await client.query("commit");

    const channel = await getChannel();

    const message: QueueMessage = {
      resourceId,
      jobId,
      jobType: JobType.DELETE_LB,
    };

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    return res.json({
      resourceId,
      jobId,
      status: "DELETING",
    });
  } catch (err) {
    await client.query("rollback");
    console.error(err);
  } finally {
    client.release();
  }
});

export { resourceRouter };
