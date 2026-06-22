import { useEffect, useState } from "react";
import { type HealthResponse } from "../types/health";
import { env } from "../env";

function Health() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    async function checkHealth() {
      const res = await fetch(`${env.API_URL}/health`);

      const data = await res.json();

      setHealth(data);
    }

    checkHealth();
  }, []);

  return (
    <div>
      <h1>Health</h1>

      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}

export { Health };
