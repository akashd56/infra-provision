import { getChannel, QUEUE_NAME } from "../lib/rabbitmq.js";
import { pool } from "../db.js";

import { deleteResource } from "./delete-resource.js";
import { provisionResource } from "./provision-resource.js";

import { JobStatus, JobType } from "../types/job.js";
import type { QueueMessage } from "../types/queue.js";

async function startWorker() {
  const channel = await getChannel();

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    let jobId!: string;
    let jobType!: JobType;

    try {
      const payload: QueueMessage = JSON.parse(msg.content.toString());

      jobId = payload.jobId;
      jobType = payload.jobType;

      await pool.query(`update jobs set status=$1 where id=$2`, [
        JobStatus.PROCESSING,
        jobId,
      ]);

      switch (jobType) {
        case JobType.PROVISION_LB:
          await provisionResource(payload);
          break;
        case JobType.DELETE_LB:
          await deleteResource(payload);
          break;
        default:
          throw new Error(`Unknown job type: ${jobType}`);
      }

      channel.ack(msg);

      return;
    } catch (err) {
      if (!jobId) {
        console.error(err);
        channel.ack(msg);
        return;
      }

      const result = await pool.query(
        `update jobs
         set attempts = attempts + 1
         where id=$1 returning attempts`,
        [jobId],
      );

      const attempts = result.rows[0].attempts;

      if (attempts >= 3) {
        await pool.query(`update jobs set status=$1 where id=$2`, [
          JobStatus.FAILED,
          jobId,
        ]);

        channel.ack(msg);
        return;
      }

      await pool.query("update jobs set status=$1 where id=$2", [
        JobStatus.PENDING,
        jobId,
      ]);

      channel.sendToQueue(QUEUE_NAME, msg.content, { persistent: true });

      channel.ack(msg);

      console.error(`err: ${err}`);
    }
  });

  return;
}

export { startWorker };
