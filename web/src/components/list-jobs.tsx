import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import { Link } from "react-router";

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <Link className="text-blue-600 underline" to="/">
        Home
      </Link>

      {jobs.length === 0 ? (
        <p className="mt-6 text-gray-500">No jobs found.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded p-3">
              <div className="font-medium">{job.type}</div>

              <div className="text-sm">Status: {job.status}</div>

              <div className="text-sm text-gray-600">
                Attempts: {job.attempts}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ListJobs };
