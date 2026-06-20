import { useEffect, useState } from "react";
import type { Job } from "../types/job";

function ListJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      const res = await fetch("http://localhost:3000/jobs", {
        method: "GET",
      });

      const data = await res.json();
      setJobs(data);
    }

    fetchJobs();

    const interval = setInterval(fetchJobs, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>Jobs List</h2>

      <ul>
        {jobs.map((job: Job) => (
          <li key={job.id}>
            {job.type} - {job.status} - attempts: {job.attempts}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { ListJobs };
