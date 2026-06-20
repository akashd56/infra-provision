import { Router } from "express";
import { pool } from "../../db.js";
import { LbStatus } from "../../types/lb.js";
import { JobStatus, JobType } from "../../types/job.js";
import { getChannel, QUEUE_NAME } from "../../lib/rabbitmq.js";
import type { QueueMessage } from "../../types/queue.js";

const lbRouter: Router = Router();

lbRouter.delete("/loadbalancers/:id", async (req, res) => {
  const lbId = req.params.id;

  if (!lbId) throw new Error("Missing loadbalancer ID");

  const client = await pool.connect();

  try {
    await client.query("begin");

    await client.query("update load_balancers set status=$1 where id=$2", [
      LbStatus.DELETING,
      lbId,
    ]);

    const jobId = crypto.randomUUID();

    await client.query(
      "insert into jobs ( id, type, payload, status) values ($1, $2, $3, $4)",
      [jobId, JobType.DELETE_LB, { lbId }, JobStatus.PENDING],
    );

    await client.query("commit");

    const channel = await getChannel();

    const message: QueueMessage = {
      lbId,
      jobId,
      jobType: JobType.DELETE_LB,
    };

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    return res.json({
      lbId,
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

export { lbRouter };
