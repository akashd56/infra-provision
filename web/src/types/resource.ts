export type ResourceImage = "nginx:latest" | "redis:latest" | "postgres:17";

export type Resource = {
  id: string;
  name: string;
  status: string;
  image: ResourceImage;
};
