import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { startWorker } from "./workers/worker.js";
import { getChannel, QUEUE_NAME } from "./mq.js";
import { JobStatus, JobType } from "./types/job.js";
import { LbStatus } from "./types/lb.js";

const PORT = 3000;

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/loadbalancers", async (_req, res) => {
    const result = await pool.query(
      `select * from load_balancers order by created_at desc`,
    );

    return res.json(result.rows);
  });

  app.get("/jobs", async (_req, res) => {
    const jobResult = await pool.query(`select * from jobs`);

    res.json(jobResult.rows);
  });

  app.post("/loadbalancers", async (req, res) => {
    const lbName = req.body.lbName;

    if (!lbName) throw new Error("Please specify resource name");

    const client = await pool.connect();

    try {
      await client.query("begin");

      const lb = {
        id: crypto.randomUUID(),
        name: lbName,
        status: LbStatus.PROVISIONING,
      };

      await client.query(
        `insert into load_balancers (id, name, status ) values ($1, $2, $3)`,
        [lb.id, lb.name, lb.status],
      );

      const job = {
        id: crypto.randomUUID(),
        type: JobType.PROVISION_LB,
        payload: {
          lbId: lb.id,
        },
        status: JobStatus.PENDING,
      };

      await client.query(
        `insert into jobs (id, type, payload, status ) values ($1, $2, $3, $4)`,
        [job.id, job.type, job.payload, job.status],
      );

      await client.query("commit");

      const channel = await getChannel();

      channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(
          JSON.stringify({
            lbId: lb.id,
            jobId: job.id,
            jobType: JobType.PROVISION_LB,
          }),
        ),
        { persistent: true },
      );

      return res.status(200).json(lb);
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  });

  // simulates a running queue, that processes tasks one at a time

  startWorker();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

main().catch(console.error);
