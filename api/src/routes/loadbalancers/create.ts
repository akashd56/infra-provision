import { Router } from "express";
import { pool } from "../../db.js";

import { LbStatus } from "../../types/lb.js";
import { JobStatus, JobType } from "../../types/job.js";
import { SupportedImages } from "../../types/images.js";

import { getChannel, QUEUE_NAME } from "../../lib/rabbitmq.js";
import type { QueueMessage } from "../../types/queue.js";

const createLbRouter: Router = Router();

createLbRouter.post("/loadbalancers", async (req, res) => {
  const { resourceName, resource } = req.body;

  console.log(resource);

  if (!resourceName) throw new Error("Please specify resource name");

  const client = await pool.connect();

  try {
    await client.query("begin");

    // validate the resource
    if (!Object.values(SupportedImages).includes(resource))
      throw new Error("Unsupported Image");

    const lb = {
      id: crypto.randomUUID(),
      name: resourceName,
      status: LbStatus.PROVISIONING,
      image: resource,
    };

    await client.query(
      `insert into load_balancers (id, name, image, status) values ($1, $2, $3, $4)`,
      [lb.id, lb.name, lb.image, lb.status],
    );

    const job = {
      id: crypto.randomUUID(),
      type: JobType.PROVISION_LB,
      payload: {
        lbId: lb.id,
      },
      status: JobStatus.PENDING,
    };

    await client.query(
      `insert into jobs (id, type, payload, status ) values ($1, $2, $3, $4)`,
      [job.id, job.type, job.payload, job.status],
    );

    await client.query("commit");

    const channel = await getChannel();

    const message: QueueMessage = {
      lbId: lb.id,
      jobId: job.id,
      jobType: JobType.PROVISION_LB,
    };

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    return res.status(200).json(lb);
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
});

export { createLbRouter };
