import { useEffect, useState } from "react";
import type { Resource } from "../../types/resource";
import { env } from "../../env";
import { PageState } from "../layout/page-state";
import { Navbar } from "../layout/navbar";
import { StatusBadge } from "../badges/status-badge";

function ListResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch(`${env.API_URL}/resources`, {
          method: "GET",
        });

        const data = await res.json();
        setResources(data);
        setError(null);
      } catch {
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    }

    fetchResources(); // why dont we await this

    const interval = setInterval(() => {
      fetchResources();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function deleteResource(resourceId: string) {
    await fetch(`${env.API_URL}/resources/${resourceId}`, {
      method: "delete",
    });
  }

  if (loading || error) {
    return (
      <>
        <PageState
          loading={loading}
          error={error}
          loadingMessage="Loading resources..."
        />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Resources</h1>

        {resources.length === 0 ? (
          <p className="mt-6 text-gray-500">No resources found.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-gray-600">{resource.image}</div>
                  <div className="text-sm text-gray-600">
                    {resource.container_id}
                  </div>

                  <StatusBadge status={resource.status} />
                </div>

                {resource.status !== "DELETED" && (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => deleteResource(resource.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ListResources;
