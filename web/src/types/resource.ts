export type ResourceImage = "nginx:latest" | "redis:latest" | "postgres:17";

export type ResourceStatus =
  | "PROVISIONED"
  | "PROVISIONING"
  | "DELETING"
  | "DELETED";

export type Resource = {
  id: string;
  name: string;
  status: ResourceStatus;
  image: ResourceImage;
  container_id: string;
};
