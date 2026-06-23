import { useState } from "react";
import { env } from "./env";
import { Navbar } from "./components/layout/navbar";

import "./index.css";

function App() {
  const [resourceName, setResourceName] = useState("");
  const [resource, setResource] = useState("nginx:latest");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createResource() {
    setLoading(true);

    try {
      const res = await fetch(`${env.API_URL}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceName, resource }),
      });

      const data = await res.json();
      setResponse(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
        <div className="w-full max-w-xl bg-white border rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-1">Provision Resource</h1>

          <p className="text-sm text-gray-500 mb-6">
            Create and deploy a Docker-based infrastructure resource
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Resource Name
              </label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g. redis-cache"
              />
            </div>

            {/* IMAGE SELECT */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Container Image
              </label>
              <select
                value={resource}
                onChange={(e) => setResource(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="nginx:latest">nginx:latest</option>
                <option value="redis:latest">redis:latest</option>
                <option value="postgres:17">postgres:17</option>
              </select>
            </div>

            <button
              onClick={createResource}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating..." : "Create Resource"}
            </button>
          </div>

          {response && (
            <div className="mt-6">
              <div className="text-sm font-medium text-green-600 mb-2">
                Resource Created
              </div>

              <pre className="bg-gray-900 text-green-300 text-xs p-3 rounded-lg overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
