"use client"

import { useState } from "react"
// import { useToast } from "@/hooks/use-toast"
import { TIME_MAP } from "@/constants/timeslot"
import { type TimeInt } from "@/constants/timeslot"

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

  const markAsVacant = async (scheduleId: string, reason: string) => {
    setLoading(true)
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/schedule/${scheduleId}/mark-vacant`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // })

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(`Marking schedule ${scheduleId} as vacant with reason: ${reason}`)

      // toast({
      //   title: "Class marked as vacant",
      //   description: "Students will be notified about the vacancy.",
      // })

      onRefresh?.()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to mark class as vacant. Please try again.",
      //   variant: "destructive",
      // })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const claimSlot = async (scheduleId: string, borrowingData: BorrowingData) => {
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

      console.log(`Creating classroom borrowing:`, {
        scheduleId,
        classroomId: borrowingData.classroomId,
        facultyId: borrowingData.facultyId,
        date: borrowingData.date.toISOString(),
        startTime: borrowingData.startTime,
        endTime: borrowingData.endTime,
        subject: borrowingData.subject,
        section: borrowingData.section,
      })

      // Use your TIME_MAP to format the time display
      const startTimeLabel = TIME_MAP[borrowingData.startTime] || `${borrowingData.startTime}`
      const endTimeLabel = TIME_MAP[borrowingData.endTime] || `${borrowingData.endTime}`

      // toast({
      //   title: "Room borrowed successfully",
      //   description: `${borrowingData.subject} - ${borrowingData.section} scheduled for ${startTimeLabel} - ${endTimeLabel}`,
      // })

      onRefresh?.()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to borrow room. Please try again.",
      //   variant: "destructive",
      // })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelBorrowing = async (scheduleId: string) => {
    setLoading(true)
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/classroom-borrowing/${scheduleId}`, {
      //   method: 'DELETE'
      // })

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(`Cancelling classroom borrowing for schedule ${scheduleId}`)

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
