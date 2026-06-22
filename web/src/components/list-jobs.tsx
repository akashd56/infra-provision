import { useEffect, useState } from "react";
import type { Job } from "../types/job";
import { Link } from "react-router";
import { LoadingMessage } from "./loading-message";
import { ErrorMessage } from "./error-message";
import { env } from "../env";

function ListJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(`${env.API_URL}/jobs`, {
          method: "GET",
        });

        const data = await res.json();
        setJobs(data);
        setError(null);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();

    const interval = setInterval(fetchJobs, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingMessage message="Loading resources..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
