export const ResourceStatus = {
  PROVISIONING: "PROVISIONING",
  PROVISIONED: "PROVISIONED",
  FAILED: "FAILED",
  DELETING: "DELETING",
  DELETED: "DELETED",
} as const;

export type ResourceStatus =
  (typeof ResourceStatus)[keyof typeof ResourceStatus];
