import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { startWorker } from "./workers/worker.js";
import { lbRouter } from "./routes/loadbalancers/delete.js";
import { dockerRouter } from "./routes/docker/test.js";
import { createLbRouter } from "./routes/loadbalancers/create.js";

const PORT = 3000;

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(lbRouter);
  app.use(createLbRouter);
  app.use(dockerRouter);

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

  // simulates a running queue, that processes tasks one at a time

  startWorker();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

main().catch(console.error);
