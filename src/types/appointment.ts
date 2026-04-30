export type Appointment = {
  id: number;
  date: string;
  slot: "morning" | "afternoon" | "evening";
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  repair?: {
    id: number;
  };
};
