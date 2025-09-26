import { notifyRoomRequestor } from '@/emails/notify-room-requestor'
import { RoomRequestResponseEmail } from '@/emails/room-request-response'
import React from 'react'


const page = () => {
  //notifyRoomRequestor("878be8c7-441d-4a08-b2c4-542a69ac7f8c")
  return (
    <RoomRequestResponseEmail
      classroomName="Room 1"
      date={new Date()}
      startTime={700}
      endTime={800}
      subject="Web Development"
      section="BSIT 3D"
      responderName="John Doe"
      status="accepted"
    />
  )
}

export default page