import { pool } from "../db.js";
import { claimNextJob } from "./claim-job.js";
import { provisionLb } from "./provision-lb.js";

let running = false;

function startWorker() {
  setInterval(async () => {
    if (running) return;

    running = true;

    const client = await pool.connect();

    try {
      const job = await claimNextJob();

      if (!job) return;

      const lbId = job.payload.lbId;
      const jobId = job.id;

      await provisionLb(lbId, jobId);

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
