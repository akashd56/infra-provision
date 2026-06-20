import { Router } from "express";
import { docker } from "../../lib/docker.js";

const dockerRouter: Router = Router();

dockerRouter.get("/docker-test", async (_, res) => {
  const version = await docker.version();

  res.json(version);
});

export { dockerRouter };
