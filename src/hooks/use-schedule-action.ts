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

      onRefresh?.()
    } catch (error) {

      throw error
    } finally {
      setLoading(false)
    }
  }

  const claimSlot = async (schedule: FinalClassroomSchedule, data: BorrowingData) => {
    setLoading(true)
    try {
      // Replace with your actual API call to create classroom borrowing
      // const response = await fetch('/api/classroom-borrowing', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     classroomId: borrowingData.classroomId,
      //     facultyId: borrowingData.facultyId,
      //     date: borrowingData.date.toISOString(),
      //     startTime: borrowingData.startTime,
      //     endTime: borrowingData.endTime,
      //     subject: borrowingData.subject,
      //     section: borrowingData.section
      //   })
      // })

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use your TIME_MAP to format the time display
      const startTimeLabel = TIME_MAP[schedule.startTime] || `${schedule.startTime}`
      const endTimeLabel = TIME_MAP[schedule.endTime] || `${schedule.endTime}`



      onRefresh?.()
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
