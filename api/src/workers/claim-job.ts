import { pool } from "../db.js";

async function claimNextJob() {
  const client = await pool.connect();

  try {
    await client.query("begin");

    /**
     * picks the pending job
     */
    const jobResult = await client.query(
      `select * from jobs where status='PENDING' order by created_at limit 1 for update skip locked`, // skips locked rows, so worker doesn't wait for lock
    );

    const job = jobResult.rows[0];

    if (!job) {
      await client.query("commit");
      return;
    }

    await client.query(
      `update jobs set status='PROCESSING',attempts=attempts+1 where id=$1`,
      [job.id],
    );

    await client.query("commit");

    return job;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export { claimNextJob };
