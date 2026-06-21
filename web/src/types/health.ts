type HealthResponse = {
  status: "ok" | "degraded";
  database: "up" | "down";
  rabbitmq: "up" | "down";
  docker: "up" | "down";
};

export { type HealthResponse };
