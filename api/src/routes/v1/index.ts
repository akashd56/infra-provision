import { Router } from "express";
import { healthCheckRouter } from "./health.js";
import { resourcesRouter } from "./resources.js";
import { jobsRouter } from "./jobs.js";

const v1Router: Router = Router();

v1Router.use("/health", healthCheckRouter);
v1Router.use("/resources", resourcesRouter);
v1Router.use("/jobs", jobsRouter);

export { v1Router };
