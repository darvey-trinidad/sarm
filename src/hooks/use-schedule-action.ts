"use client"

import { useState } from "react"
// import { useToast } from "@/hooks/use-toast"
import { TIME_MAP } from "@/constants/timeslot"
import { type TimeInt } from "@/constants/timeslot"
import { api } from "@/trpc/react"
import type { FinalClassroomSchedule } from "@/types/clasroom-schedule"
import { toast } from "sonner";

interface BorrowingData {
  classroomId: string
  facultyId: string
  date: Date
  startTime: TimeInt // Using your TimeInt type instead of minutes
  endTime: TimeInt // Using your TimeInt type instead of minutes
  subject: string | null
  section: string | null
}

interface UseScheduleActionsProps {
  onRefresh?: () => void
}

export function useScheduleActions({ onRefresh }: UseScheduleActionsProps = {}) {
  const [loading, setLoading] = useState(false)
  // const { toast } = useToast()

  const {
    mutate: createClassroomVacancy,
    isPending: isPendingCreateVacancy,
    isError: isErrorCreateVacancy,
    isSuccess: isSuccessCreateVacancy
  } = api.classroomSchedule.createClassroomVacancy.useMutation();

  const {
    mutate: createClassroomBorrowing,
    isPending: isPendingCreateBorrowing,
    isError: isErrorCreateBorrowing,
    isSuccess: isSuccessCreateBorrowing
  } = api.classroomSchedule.createClassroomBorrowing.useMutation();

  const markAsVacant = async (schedule: FinalClassroomSchedule, data: BorrowingData, reason: string) => {
    setLoading(true)
    try {
      createClassroomVacancy({
        classroomId: schedule.classroomId,
        date: schedule.date,
        startTime: (data.startTime).toString(),
        endTime: (data.endTime).toString(),
        reason
      }, {
        onSuccess: () => {
          toast("Classroom marked as vacant");
          onRefresh?.()
        },
        onError: () => { toast("Failed to mark classroom as vacant") }
      })
    } catch (error) {

      throw error
    } finally {
      setLoading(false)
    }
  }

  const claimSlot = async (schedule: FinalClassroomSchedule, data: BorrowingData) => {
    setLoading(true)
    try {
      createClassroomBorrowing({
        classroomId: schedule.classroomId,
        date: schedule.date,
        startTime: (data.startTime).toString(),
        endTime: (data.endTime).toString(),
        facultyId: data.facultyId,
        subject: data.subject,
        section: data.section
      }, {
        onSuccess: () => {
          toast("Slot claimed");
          onRefresh?.()
        },
        onError: () => { toast("Failed to claim slot") }
      })

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use your TIME_MAP to format the time display
      const startTimeLabel = TIME_MAP[schedule.startTime] || `${schedule.startTime}`
      const endTimeLabel = TIME_MAP[schedule.endTime] || `${schedule.endTime}`

    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelBorrowing = async (schedule: FinalClassroomSchedule, data: BorrowingData) => {
    setLoading(true)
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/classroom-borrowing/${scheduleId}`, {
      //   method: 'DELETE'
      // })

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // toast({
      //   title: "Borrowing cancelled",
      //   description: "The room is now available for others to borrow.",
      // })

      onRefresh?.()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to cancel borrowing. Please try again.",
      //   variant: "destructive",
      // })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    markAsVacant,
    claimSlot,
    cancelBorrowing,
    loading,
  }
}

export type { BorrowingData }
