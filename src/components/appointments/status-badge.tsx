type Status = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    SCHEDULED: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}
