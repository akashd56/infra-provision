import { useEffect, useState } from "react";
import type { LoadBalancer } from "../types/lb";

function ListLbs() {
  const [lbs, setLbs] = useState<LoadBalancer[]>([]);

  useEffect(() => {
    async function fetchLbs() {
      const res = await fetch("http://localhost:3000/loadbalancers", {
        method: "GET",
      });

      const data = await res.json();
      setLbs(data);
    }

    fetchLbs(); // why dont we await this

    const interval = setInterval(() => {
      fetchLbs();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function deleteLb(lbId: string) {
    await fetch(`http://localhost:3000/loadbalancers/${lbId}`, {
      method: "delete",
    });
  }

  return (
    <div>
      <h2>LB List</h2>

      <ul>
        {lbs.map((lb: LoadBalancer) => (
          <li key={lb.id}>
            {lb.name} - {lb.status}
            <button onClick={() => deleteLb(lb.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListLbs;
