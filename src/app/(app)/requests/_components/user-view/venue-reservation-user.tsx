"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { TIME_MAP } from "@/constants/timeslot";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { ReservationStatus } from "@/constants/reservation-status";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  FileText,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleOff,
  Package,
} from "lucide-react";
import { formatLocalTime, formatISODate } from "@/lib/utils";
import LoadingMessage from "@/components/loading-state/loading-message";
import NoReports from "@/components/loading-state/no-reports";
import { authClient } from "@/lib/auth-client";
import { appRouter } from "@/server/api/root";
export default function VenueReservationUser() {
  const [seletedTerm, setSelectedTerm] = useState<string>("");

  return (
    <div>
      <h1>Venue Reservation User</h1>
    </div>
  );
}
