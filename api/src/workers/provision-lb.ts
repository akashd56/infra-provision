import { pool } from "../db.js";
import { JobStatus } from "../types/job.js";
import { LbStatus } from "../types/lb.js";

async function provisionLb(lbId: string, jobId: string) {
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

    console.log(`Provisioning Load Balancer: ${lbId}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // demonstrate failure state
    if (Math.random() < 0.1) {
      await pool.query(`update load_balancers set status=$1 where id=$2`, [
        LbStatus.FAILED,
        lbId,
      ]);

      await pool.query(`update jobs set status=$1 where id=$2`, [
        JobStatus.FAILED,
        jobId,
      ]);

      return;
    }

    await pool.query(`update load_balancers set status=$1 where id=$2`, [
      LbStatus.PROVISIONED,
      lbId,
    ]);

    await pool.query(`update jobs set status=$1 where id=$2`, [
      JobStatus.DONE,
      jobId,
    ]);
  } catch (err) {
    throw err;
  }
}

export { provisionLb };
