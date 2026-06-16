import { getChannel, QUEUE_NAME } from "../mq.js";
import { pool } from "../db.js";

import { deleteLb } from "./delete-lb.js";
import { provisionLb } from "./provision-lb.js";

import { JobStatus, JobType } from "../types/job.js";

async function startWorker() {
  const channel = await getChannel();

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      const { lbId, jobId, jobType } = payload;

      await pool.query(`update jobs set status=$1 where id=$2`, [
        JobStatus.PROCESSING,
        jobId,
      ]);

      switch (jobType) {
        case JobType.PROVISION_LB:
          await provisionLb(lbId, jobId);
          break;
        case JobType.DELETE_LB:
          await deleteLb(lbId, jobId);
          break;
        default:
          throw new Error(`Unknown job type: ${jobType}`);
      }

      channel.ack(msg);
    } catch (err) {
      console.error(`err: ${err}`);
    }
  });

  return;
}

export { startWorker };
