export type JobStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export type JobType = "PROVISION_LB" | "DELETE_LB";

export type Job = {
  id: string;
  type: JobType;
  status: JobStatus;
  attempts: number;
};
