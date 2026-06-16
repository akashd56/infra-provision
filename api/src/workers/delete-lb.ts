import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { LbStatus } from "../types/lb.js";

async function deleteLb(lbId: string, jobId: string) {
  try {
    const lbResult = await pool.query(
      `select * from load_balancers where id=$1`,
      [lbId],
    );

    if (lbResult.rows.length === 0) {
      await pool.query(`update jobs set status='FAILED' where id=$1`, [jobId]);
      return;
    }

    console.log(`Deleting Load Balancer: ${lbId}`);

    // simulate work
    await new Promise((resolve) => setTimeout(resolve, 4000));

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
