export const LbStatus = {
  PROVISIONING: "PROVISIONING",
  PROVISIONED: "PROVISIONED",
  FAILED: "FAILED",
  DELETING: "DELETING",
  DELETED: "DELETED",
} as const;

export type LbStatus = (typeof LbStatus)[keyof typeof LbStatus];
