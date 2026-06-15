import { pool } from "../db.js";

async function provisionLb(lbId: string, jobId: string) {
  try {
    const lbResult = await pool.query(
      `select * from load_balancers where id=$1`,
      [lbId],
    );

    if (lbResult.rows.length === 0) {
      await pool.query(`update jobs set status='FAILED' where id=$1`, [jobId]);

      return;
    }

    console.log(`Provisioning Load Balancer: ${lbId}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // demonstrate failure state
    if (Math.random() < 0.1) {
      await pool.query(
        `update load_balancers set status='FAILED' where id=$1`,
        [lbId],
      );

      await pool.query(`update jobs set status='FAILED' where id=$1`, [jobId]);

      return;
    }

    await pool.query(
      `update load_balancers set status='PROVISIONED' where id=$1`,
      [lbId],
    );

    await pool.query(`update jobs set status='DONE' where id=$1`, [jobId]);
  } catch (err) {
    throw err;
  }
}

export { provisionLb };
