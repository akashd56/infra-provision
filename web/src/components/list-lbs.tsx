import { useEffect, useState } from "react";

function ListLbs() {
  const [lbs, setLbs] = useState([]);

  useEffect(() => {
    async function fetchLbs() {
      const res = await fetch("http://localhost:3000/loadbalancers", {
        method: "GET",
      });

      const data = await res.json();
      setLbs(data);
    }

    fetchLbs();

    const interval = setInterval(() => {
      fetchLbs();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>LB List</h2>

      <ul>
        {lbs.map((lb: any) => (
          <li key={lb.id}>
            {lb.name} - {lb.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListLbs;
