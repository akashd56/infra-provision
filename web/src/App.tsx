import { useState } from "react";
import { Link } from "react-router";
import "./index.css";

function App() {
  const [resourceName, setResourceName] = useState("");
  const [resource, setResource] = useState("nginx:latest"); // this string is the default value of the dropdown
  const [response, setResponse] = useState(null);

  async function createResource() {
    const res = await fetch("http://localhost:3000/loadbalancers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resourceName, resource }),
    });

    const data = await res.json();
    setResponse(data);

    console.log(resource);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Provision Resource</h1>

      <div className="flex gap-4 mb-6">
        <Link className="text-blue-600 underline" to="/resources">
          Resources
        </Link>

        <Link className="text-blue-600 underline" to="/jobs">
          Jobs
        </Link>

        <Link className="text-blue-600 underline" to="/health">
          Health
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          value={resourceName} // let's you change the default display value
          onChange={(e) => setResourceName(e.target.value)}
          placeholder="Resource name"
        />
        <select
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="nginx:latest">nginx:latest</option>
          <option value="redis:latest">redis:latest</option>
          <option value="postgres:17">postgres:17</option>
        </select>
        <button
          onClick={createResource}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          create
        </button>
      </div>

      {response && (
        <pre className="mt-4 border p-3 rounded bg-green-300">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
