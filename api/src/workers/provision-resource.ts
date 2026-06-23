import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { ResourceStatus } from "../types/resource.js";
import type { QueueMessage } from "../types/queue.js";

import { docker } from "../lib/docker/docker.js";
import { pullImage } from "../lib/docker/pull-image.js";

async function provisionResource(payload: QueueMessage) {
  const { resourceId, jobId } = payload;
  const resourceResult = await pool.query(
    `select * from load_balancers where id=$1`,
    [resourceId],
  );

  if (resourceResult.rows.length === 0) {
    await pool.query(
      `update jobs set status=$1, updated_at=now() where id=$2`,
      [JobStatus.FAILED, jobId],
    );

    return;
  }

  const resource = resourceResult.rows[0];

  if (resource.status === ResourceStatus.PROVISIONED) {
    await pool.query(
      `update jobs set status=$1, updated_at=now() where id=$2`,
      [JobStatus.DONE, jobId],
    );

    return;
  }

  try {
    await docker.getImage(resource.image).inspect();
  } catch {
    console.log(
      `${resource.image} not found locally. Donwloading ${resource.image}...`,
    );

    await pullImage(resource.image);
  }

  const containerEnv: string[] = [];
  if (resource.image === "postgres:17") {
    containerEnv.push("POSTGRES_PASSWORD=postgres");
  }

  const container = await docker.createContainer({
    Image: resource.image,
    Env: containerEnv,
  });

  await container.start();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const info = await container.inspect();

  if (!info.State.Running) {
    await container.remove({ force: true });

    throw new Error("Container failed to start");
  }

  await pool.query(
    `update load_balancers set status=$1, container_id=$2 where id=$3`,
    [ResourceStatus.PROVISIONED, container.id, resourceId],
  );

  await pool.query(`update jobs set status=$1, updated_at=now() where id=$2`, [
    JobStatus.DONE,
    jobId,
  ]);
}

export { provisionResource };
