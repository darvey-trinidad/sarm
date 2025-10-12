"use client";

import { useState } from "react";
// import { useToast } from "@/hooks/use-toast"
import { TIME_MAP } from "@/constants/timeslot";
import { type TimeInt } from "@/constants/timeslot";
import { api } from "@/trpc/react";
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface BorrowingData {
  classroomId: string;
  facultyId: string;
  date: Date;
  startTime: TimeInt; // Using your TimeInt type instead of minutes
  endTime: TimeInt; // Using your TimeInt type instead of minutes
  subject: string | null;
  section: string | null;
}

interface UseScheduleActionsProps {
  onRefresh?: () => void;
}

export function useScheduleActions({
  onRefresh,
}: UseScheduleActionsProps = {}) {
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast()

  const { data: session } = authClient.useSession();

  const {
    mutate: createClassroomVacancy,
    isPending: isPendingCreateVacancy,
    isError: isErrorCreateVacancy,
    isSuccess: isSuccessCreateVacancy,
  } = api.classroomSchedule.createClassroomVacancy.useMutation();

  const {
    mutate: createClassroomBorrowing,
    isPending: isPendingCreateBorrowing,
    isError: isErrorCreateBorrowing,
    isSuccess: isSuccessCreateBorrowing,
  } = api.classroomSchedule.createClassroomBorrowing.useMutation();

  const {
    mutate: cancelClassroomBorrowing,
    isPending: isPendingCancelBorrowing,
    isError: isErrorCancelBorrowing,
    isSuccess: isSuccessCancelBorrowing,
  } = api.classroomSchedule.cancelClassroomBorrowing.useMutation();

  const { mutateAsync: createRoomRequest } =
    api.classroomSchedule.createRoomRequest.useMutation();

  const requestToBorrow = async (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => {
    setLoading(true);
    try {
      await createRoomRequest(
        {
          classroomId: schedule.classroomId,
          date: schedule.date,
          startTime: data.startTime.toString(),
          endTime: data.endTime.toString(),

          requesterId: session?.user.id ?? "",
          responderId: schedule.facultyId ?? "",

          subject: data.subject ?? "",
          section: data.section ?? "",
        },
        {
          onSuccess: () => {
            toast("Room request sent");
            onRefresh?.();
          },
          onError: (error) => {
            toast(error.message ?? "Failed to send room request");
          },
        },
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAsVacant = async (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => {
    setLoading(true);
    try {
      createClassroomVacancy(
        {
          classroomId: schedule.classroomId,
          date: schedule.date,
          startTime: data.startTime.toString(),
          endTime: data.endTime.toString(),
        },
        {
          onSuccess: () => {
            toast("Classroom marked as vacant");
            onRefresh?.();
          },
          onError: () => {
            toast("Failed to mark classroom as vacant");
          },
        },
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const claimSlot = async (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => {
    setLoading(true);
    try {
      createClassroomBorrowing(
        {
          classroomId: schedule.classroomId,
          date: schedule.date,
          startTime: data.startTime.toString(),
          endTime: data.endTime.toString(),
          facultyId: session?.user.id ?? "",
          subject: data.subject,
          section: data.section,
        },
        {
          onSuccess: () => {
            toast("Slot claimed");
            onRefresh?.();
          },
          onError: () => {
            toast("Failed to claim slot");
          },
        },
      );

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use your TIME_MAP to format the time display
      const startTimeLabel =
        TIME_MAP[schedule.startTime] || `${schedule.startTime}`;
      const endTimeLabel = TIME_MAP[schedule.endTime] || `${schedule.endTime}`;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelBorrowing = async (
    schedule: FinalClassroomSchedule,
    data: BorrowingData,
  ) => {
    setLoading(true);
    try {
      cancelClassroomBorrowing(
        {
          classroomId: schedule.classroomId,
          date: schedule.date,
          startTime: schedule.startTime.toString(),
          endTime: schedule.endTime.toString(),
        },
        {
          onSuccess: () => {
            toast("Borrowing canceled");
            onRefresh?.();
          },
          onError: () => {
            toast("Failed to cancel borrowing");
          },
        },
      );

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onRefresh?.();
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to cancel borrowing. Please try again.",
      //   variant: "destructive",
      // })
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    markAsVacant,
    claimSlot,
    cancelBorrowing,
    requestToBorrow,
    loading,
  };
}

export type { BorrowingData };
