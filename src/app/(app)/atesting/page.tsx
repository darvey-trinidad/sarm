import React from 'react'
import { ReservationRequestEmail } from '@/emails/reservation-request'

const ReservationUpdate = () => {
  return (
    <ReservationRequestEmail
      venueName='venueName'
      reserverName='reserverName'
      date='date'
      time='time'
      purpose='purpose'
    />
  )
}

export default ReservationUpdate