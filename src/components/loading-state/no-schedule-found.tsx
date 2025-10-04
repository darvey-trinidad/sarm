import { CalendarX } from "lucide-react";
export default function NoScheduleFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <CalendarX className="text-muted-foreground h-10 w-10" />

      <div>
        <h3 className="text-foreground text-xl font-semibold">
          No Schedules Found.
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
          You don't have any scheduled classes at the moment. Check back later
          or contact administration.
        </p>
      </div>
    </div>
  );
}
