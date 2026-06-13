import { pool } from "../db.js";

let running = false;

function startWorker() {
  setInterval(async () => {
    if (running) return;

    running = true;

    const client = await pool.connect();

    try {
      await client.query("begin");

      const jobResult = await client.query(
        `select * from jobs where status='PENDING' order by created_at limit 1 for update skip locked`,
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

      await client.query(`commit`);

      const lbId = job.payload.lbId;

      const result = await client.query(
        `select * from load_balancers where id=$1`,
        [lbId],
      );

      if (result.rows.length === 0) {
        await client.query("begin");
        await client.query(`update jobs set status='FAILED' where id=$1`, [
          job.id,
        ]);

        await client.query("commit");
        return;
      }

      console.log(`Provisioning Load Balancer: ${lbId}`);

      // demonstrate failure state
      if (Math.random() < 0.1) {
        await client.query("begin");

        await client.query(
          `update load_balancers set status='FAILED' where id=$1`,
          [lbId],
        );

        await client.query(`update jobs set status='FAILED' where id=$1`, [
          job.id,
        ]);

        await client.query("commit");

        return;
      }

      await client.query("begin");

      await client.query(
        `update load_balancers set status='PROVISIONED' where id=$1`,
        [lbId],
      );

      await client.query(`update jobs set status='DONE' where id=$1`, [job.id]);

      await client.query("commit");

      return;
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      running = false;
      client.release();
    }
  }, 4000);
}

export { startWorker };
