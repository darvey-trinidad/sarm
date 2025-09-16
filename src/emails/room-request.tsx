import { Html } from "@react-email/html";

interface EmailProps {
  requestorName: string;
  classroomName: string;
  date: Date;
  startTime: number;
  endTime: number;
  subject: string;
  section: string;
  lendUrl: string;
  declineUrl: string;
}

export function RequestRoomEmail(
  {
    requestorName,
    date,
    startTime,
    endTime,
    subject,
    section,
    lendUrl,
    declineUrl,
  }: EmailProps
) {
  return (
    <Html>
      <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
        <h2>Room Request</h2>
        <p>
          Professor <strong>{requestorName}</strong> is requesting a room.
        </p>
        <p>
          <strong>Date:</strong> {date.getMonth() + 1} - {date.getDate()} - {date.getFullYear()} <br />
          <strong>Time:</strong> {startTime} - {endTime} <br />
          <strong>Subject:</strong> {subject} <br />
          <strong>Section:</strong> {section}
        </p>
        <p>
          <a href={lendUrl} style={{ marginRight: "10px" }}>✅ Lend</a>
          <a href={declineUrl}>❌ Decline</a>
        </p>
      </div>
    </Html>
  );
}
