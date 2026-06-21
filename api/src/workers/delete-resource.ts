import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { ResourceStatus } from "../types/resource.js";
import type { QueueMessage } from "../types/queue.js";

import { docker } from "../lib/docker/docker.js";

async function deleteResource(payload: QueueMessage) {
  const { resourceId, jobId } = payload;
  try {
    const resourceResult = await pool.query(
      `select * from load_balancers where id=$1`,
      [resourceId],
    );

    if (resourceResult.rows.length === 0) {
      await pool.query(`update jobs set status=$1 where id=$2`, [
        JobStatus.FAILED,
        jobId,
      ]);

      return;
    }

    const resource = resourceResult.rows[0];

    const containerId = resource.container_id;

    if (resource.status === ResourceStatus.DELETED) {
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
        ResourceStatus.DELETED,
        resourceId,
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
      ResourceStatus.DELETED,
      resourceId,
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

export { deleteResource };
