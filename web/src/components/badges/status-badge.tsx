import type { JobStatus } from "../../types/job";
import type { ResourceStatus } from "../../types/resource";

type StatusBadgeProps = {
  status: ResourceStatus | JobStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  let className = "bg-gray-100 text-gray-800";

  switch (status) {
    case "PROVISIONED":
    case "DONE":
      className = "bg-green-100 text-green-800";
      break;

    case "PROVISIONING":
    case "PROCESSING":
      className = "bg-yellow-100 text-yellow-800";
      break;

    case "PENDING":
      className = "bg-blue-100 text-blue-800";
      break;

    case "DELETING":
      className = "bg-orange-100 text-orange-800";
      break;

    case "DELETED":
    case "FAILED":
      className = "bg-red-100 text-red-800";
      break;
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {status}
    </span>
  );
}

export { StatusBadge };
