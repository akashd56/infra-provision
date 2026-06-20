import { useState } from "react";

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
    <div>
      <h2>Provision Resources</h2>
      <input
        value={resourceName} // let's you change the default display value
        onChange={(e) => setResourceName(e.target.value)}
        placeholder="Resource name"
      />
      <select value={resource} onChange={(e) => setResource(e.target.value)}>
        <option value="nginx:latest">nginx:latest</option>
        <option value="redis:latest">redis:latest</option>
        <option value="postgres:17">postgres:17</option>
      </select>
      <button onClick={createResource}>create</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

export default App;
