import { useEffect, useState } from "react";
import type { Job } from "../../types/job";
import { PageState } from "../layout/page-state";
import { Navbar } from "../layout/navbar";
import { env } from "../../env";
import { StatusBadge } from "../badges/status-badge";

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

  if (loading || error) {
    return (
      <>
        <PageState
          loading={loading}
          error={error}
          loadingMessage="Loading jobs..."
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>

        {jobs.length === 0 ? (
          <p className="mt-6 text-gray-500">No jobs found.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded p-3">
                <div className="font-medium">{job.type}</div>

                <div className="text-sm text-gray-600">
                  Attempts: {job.attempts}
                </div>

                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export { ListJobs };
