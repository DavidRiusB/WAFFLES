import { StatusBadge } from "./status-badge";
import { formatDate, formatSlot } from "@/src/lib/formatters";
import type { Appointment } from "@/src/types/appointment";

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { date, slot, status, notes, repair } = appointment;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-semibold">{formatDate(date)}</p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Slot */}
      <div>
        <p className="text-sm text-gray-500">Time Slot</p>
        <p className="capitalize font-medium">{formatSlot(slot)}</p>
      </div>

      {/* Repair info */}
      {repair && (
        <div>
          <p className="text-sm text-gray-500">Repair</p>
          <p className="text-sm">Repair #{repair.id}</p>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div>
          <p className="text-sm text-gray-500">Notes</p>
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      )}
    </div>
  );
}
