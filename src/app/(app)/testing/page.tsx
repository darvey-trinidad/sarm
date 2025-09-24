import React from 'react'
import { ReservationUpdateEmail } from '@/emails/reservation-update'
// import { notifyVenueReserver } from '@/emails/notify-venue-reserver'

const page = () => {
  return (
    <div>
      <ReservationUpdateEmail
        date='September 26, 2023'
        time='8:00 AM - 12:00 PM'
        venueName='Test Venue'
        purpose='Test Purpose'
        status='approved'
      />
    </div>
  )
}

export default page