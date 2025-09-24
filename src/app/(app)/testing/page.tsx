import React from 'react'
import { BorrowingUpdateEmail } from '@/emails/borrowing-update'
import { notifyResourceBorrower } from '@/emails/notify-resource-borrower'

const page = () => {
  //notifyResourceBorrower('b0a9bdcb-b4ca-4c9c-b501-e46285aacf74');
  return (
    <div>
      <BorrowingUpdateEmail
        date='2025-09-26'
        time='12:00 AM'
        purpose='testing'
        status='testing'
        borrowedItems={[{ name: 'testing1', quantity: 1 }, { name: 'testing2', quantity: 1 }]}
      />
    </div>
  )
}

export default page