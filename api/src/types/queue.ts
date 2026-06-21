import type { JobType } from "./job.js";

type QueueMessage = {
  resourceId: string;
  jobId: string;
  jobType: JobType;
};

export { type QueueMessage };
