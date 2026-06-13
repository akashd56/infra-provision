import { useState } from "react";

function App() {
  const [lbName, setLbName] = useState("");
  const [response, setResponse] = useState(null);

  async function createLB() {
    const res = await fetch("http://localhost:3000/loadbalancers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lbName }),
    });

    const data = await res.json();
    setResponse(data);
  }

  return (
    <div>
      <h2>Provision Resources</h2>

      <input
        value={lbName}
        onChange={(e) => setLbName(e.target.value)}
        placeholder="LB name"
      />

      <button onClick={createLB}>create</button>

      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

export default App;
