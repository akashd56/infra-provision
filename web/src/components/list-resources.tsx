import { useEffect, useState } from "react";
import type { Resource } from "../types/resource";
import { Link } from "react-router";

function ListResources() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function fetchResources() {
      const res = await fetch("http://localhost:3000/loadbalancers", {
        method: "GET",
      });

      const data = await res.json();
      setResources(data);
    }

    fetchResources(); // why dont we await this

    const interval = setInterval(() => {
      fetchResources();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function deleteResource(lbId: string) {
    await fetch(`http://localhost:3000/loadbalancers/${lbId}`, {
      method: "delete",
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>

      <Link className="text-blue-600 underline" to="/">
        Home
      </Link>

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

                <div className="text-sm font-medium">
                  Status: {resource.status}
                </div>
              </div>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => deleteResource(resource.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListResources;
