import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { LbStatus } from "../types/lb.js";
import type { QueueMessage } from "../types/queue.js";

import { docker } from "../lib/docker.js";
import { pullImage } from "../lib/pull-image.js";

async function provisionLb(payload: QueueMessage) {
  const { lbId, jobId } = payload;
  const lbResult = await pool.query(
    `select * from load_balancers where id=$1`,
    [lbId],
  );

  if (lbResult.rows.length === 0) {
    await pool.query(`update jobs set status=$1 where id=$2`, [
      JobStatus.FAILED,
      jobId,
    ]);

    return;
  }

  const lb = lbResult.rows[0];

  if (lb.status === LbStatus.PROVISIONED) {
    await pool.query(`update jobs set status=$1 where id=$2`, [
      JobStatus.DONE,
      jobId,
    ]);

    return;
  }

  try {
    await docker.getImage(lb.image).inspect();
  } catch {
    console.log(`${lb.image} not found locally. Donwloading ${lb.image}...`);

    await pullImage(lb.image);
  }

  const container = await docker.createContainer({
    Image: lb.image,
  });

  await container.start();

  await pool.query(
    `update load_balancers set status=$1, container_id=$2 where id=$3`,
    [LbStatus.PROVISIONED, container.id, lbId],
  );

  await pool.query(`update jobs set status=$1 where id=$2`, [
    JobStatus.DONE,
    jobId,
  ]);
}

export { provisionLb };
