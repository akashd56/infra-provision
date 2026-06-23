type HealthBadgeProps = {
  value: string;
};

function HealthBadge({ value }: HealthBadgeProps) {
  const className =
    value === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {value.toUpperCase()}
    </span>
  );
}

export { HealthBadge };
