import express from "express";
import cors from "cors";
import { startWorker } from "./workers/worker.js";
import { apiRouter } from "./routes/index.js";

const PORT = 3000;

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Mount API routes
  app.use("/api", apiRouter);

  // simulates a running queue, that processes tasks one at a time
  startWorker();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

main().catch(console.error);

