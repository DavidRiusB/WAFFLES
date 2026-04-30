import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function NewAppointmentPage() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      {/* Header */}
      <h1 className="text-2xl font-bold">New Appointment</h1>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <Input placeholder="Service" />
        <Input placeholder="Date" type="date" />
        <Input placeholder="Location" />
      </div>

      <Button>Create Appointment</Button>
    </div>
  );
}
