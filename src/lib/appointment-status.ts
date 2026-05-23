export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export function statusVariant(
  status: AppointmentStatus,
): "warning" | "accent" | "success" | "danger" {
  switch (status) {
    case "SCHEDULED":
      return "warning";
    case "CONFIRMED":
      return "accent";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
  }
}
