import { useEffect, useState } from "react";
import { type HealthResponse } from "../types/health";

function Health() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    async function checkHealth() {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/health`);

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
