import { Router } from "express";
import { pool } from "../../db.js";

const jobsRouter: Router = Router();

// GET /jobs
jobsRouter.get("/", async (_req, res) => {
  const jobResult = await pool.query(`select * from jobs`);

  res.json(jobResult.rows);
});

export { jobsRouter };
