import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { LbStatus } from "../types/lb.js";
import type { QueueMessage } from "../types/queue.js";

import { docker } from "../lib/docker.js";

async function deleteLb(payload: QueueMessage) {
  const { lbId, jobId } = payload;
  try {
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

    const containerId = lb.container_id;

    if (lb.status === LbStatus.DELETED) {
      await pool.query(`update jobs set status=$1 where id=$2`, [
        JobStatus.DONE,
        jobId,
      ]);

      return;
    }

    const container = docker.getContainer(containerId);

    try {
      await container.inspect();
    } catch {
      await pool.query("update load_balancers set status=$1 where id=$2", [
        LbStatus.DELETED,
        lbId,
      ]);

      await pool.query(
        `update jobs
           set status=$1
           where id=$2`,
        [JobStatus.DONE, jobId],
      );

      return;
    }

    await container.stop();
    await container.remove();

    await pool.query(`update load_balancers set status=$1 where id=$2`, [
      LbStatus.DELETED,
      lbId,
    ]);

    await pool.query(`update jobs set status=$1 where id=$2`, [
      JobStatus.DONE,
      jobId,
    ]);
  } catch (err) {
    await pool.query(`update jobs set status=$1 where id=$2`, [
      JobStatus.FAILED,
      jobId,
    ]);
    throw err;
  }
}

export { deleteLb };
