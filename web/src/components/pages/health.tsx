import { useEffect, useState } from "react";
import { type HealthResponse } from "../../types/health";
import { HealthBadge } from "../badges/health-badge";
import { env } from "../../env";
import { Navbar } from "../layout/navbar";
import { PageState } from "../layout/page-state";

function Health() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${env.API_URL}/health`);
        const data = await res.json();
        setHealth(data);
      } catch {
        setError("Failed to load health data");
      } finally {
        setLoading(false);
      }
    }

    checkHealth();

    const interval = setInterval(checkHealth, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading || error || !health) {
    return (
      <PageState
        loading={loading}
        error={error}
        loadingMessage="Checking system health..."
      />
    );
  }

  const items = [
    { label: "Database", value: health.database },
    { label: "RabbitMQ", value: health.rabbitmq },
    { label: "Docker Engine", value: health.docker },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              System Health
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time infrastructure status monitoring
            </p>
          </div>

          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow transition"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Service connectivity status
                  </div>
                </div>

                <HealthBadge value={item.value} />
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center">
            Health checks run on API polling
          </div>
        </div>
      </div>
    </>
  );
}

export { Health };
