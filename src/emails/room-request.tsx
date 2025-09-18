// components/emails/RequestRoomEmail.tsx
import { Html } from "@react-email/html";
import { DAYS } from "@/constants/days";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";

interface RequestRoomEmailProps {
  classroomName: string;
  date: Date;
  startTime: number;
  endTime: number;
  subject: string;
  section: string;
  requestorName: string;
  respondUrl: string;
}

export const RequestRoomEmail = ({
  classroomName,
  date,
  startTime,
  endTime,
  subject,
  section,
  requestorName,
  respondUrl,
}: RequestRoomEmailProps) => {
  const startTimeStr = TIME_MAP[toTimeInt(startTime)];
  const endTimeStr = TIME_MAP[toTimeInt(endTime)];

  return (
    <Html>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9fafb",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              color: "#111827",
              fontSize: "20px",
              marginBottom: "16px",
            }}
          >
            📢 New Room Request
          </h2>

          <p style={{ marginBottom: "12px", color: "#374151" }}>
            <strong>{requestorName}</strong> is requesting to borrow room{" "}
            <strong>{classroomName}</strong> on{" "}
            <strong>
              {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()} (
              {DAYS[date.getDay()]})
            </strong>{" "}
            from <strong>{startTimeStr}</strong> to{" "}
            <strong>{endTimeStr}</strong>.
          </p>

          <p style={{ marginBottom: "20px", color: "#374151" }}>
            Subject: <strong>{subject}</strong> <br />
            Section: <strong>{section}</strong>
          </p>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <a
              href={respondUrl}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#8a350e",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Respond Here
            </a>
          </div>
        </div>
      </div>
    </Html>
  );
};
