export const JobType = {
  PROVISION_LB: "PROVISION_LB",
  DELETE_LB: "DELETE_LB",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const JobStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
  DELETING: "DELETING",
  DELETED: "DELETED",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
