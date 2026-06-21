import { Router } from "express";
import { pool } from "../../db.js";

import { ResourceStatus } from "../../types/resource.js";
import { JobStatus, JobType } from "../../types/job.js";
import { SupportedImages } from "../../types/image.js";

import { getChannel, QUEUE_NAME } from "../../lib/rabbitmq.js";
import type { QueueMessage } from "../../types/queue.js";

const createResourceRouter: Router = Router();

createResourceRouter.post("/loadbalancers", async (req, res) => {
  const { resourceName, resource: image } = req.body;

  if (!resourceName) throw new Error("Please specify resource name");

  const client = await pool.connect();

  try {
    await client.query("begin");

    // validate the resource
    if (!Object.values(SupportedImages).includes(image))
      throw new Error("Unsupported Image");

    const resource = {
      id: crypto.randomUUID(),
      name: resourceName,
      status: ResourceStatus.PROVISIONING,
      image,
    };

    await client.query(
      `insert into load_balancers (id, name, image, status) values ($1, $2, $3, $4)`,
      [resource.id, resource.name, resource.image, resource.status],
    );

    const job = {
      id: crypto.randomUUID(),
      type: JobType.PROVISION_LB,
      payload: {
        resourceId: resource.id,
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
      resourceId: resource.id,
      jobId: job.id,
      jobType: JobType.PROVISION_LB,
    };

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    return res.status(200).json(resource);
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
});

export { createResourceRouter };
