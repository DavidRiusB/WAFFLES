import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AppointmentCard } from "@/src/components/appointments/appointment-card";
import type { Appointment } from "@/src/types/appointment";

function EmptyState() {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">
      <p className="text-gray-500 mb-4">You have no appointments yet</p>

      <Link href="/appointments/new">
        <Button>Create your first appointment</Button>
      </Link>
    </div>
  );
}

export default function AppointmentsPage() {
  const appointments: Appointment[] = [
    {
      id: 1,
      date: "2026-04-30",
      slot: "morning",
      status: "SCHEDULED",
      notes: "Client prefers early visit",
    },
    {
      id: 2,
      date: "2026-05-01",
      slot: "afternoon",
      status: "CONFIRMED",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>

        <Link href="/appointments/new">
          <Button>New Appointment</Button>
        </Link>
      </div>

      {/* Content */}
      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
