import type { JobType } from "./job.js";

type QueueMessage = {
  lbId: string;
  jobId: string;
  jobType: JobType;
};

export { type QueueMessage };
