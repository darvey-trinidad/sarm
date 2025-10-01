import React from 'react'
import { BorrowingRequestEmail } from '@/emails/borrowing-request'

const ReservationUpdate = () => {
  return (
    <BorrowingRequestEmail
      borrowerName='John Doe'
      date='2023-09-01'
      time='10:00 AM'
      purpose='Testing'
      borrowedItems={[{ name: 'Item 1', quantity: 1 }, { name: 'Item 2', quantity: 2 }, { name: 'Item 3', quantity: 3 }]}
    />
  )
}

export default ReservationUpdate