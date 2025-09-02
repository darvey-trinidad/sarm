import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Header() {
  return (
    <div className="items-center justify-between gap-4">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <Link href="/schedule">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Hall</h1>
          <p className="text-muted-foreground">
            View social hall schedules and bookings
          </p>
        </div>
      </div>
    </div>
  );
}
