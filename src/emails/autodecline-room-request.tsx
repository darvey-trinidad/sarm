import { Html } from "@react-email/html";
import { DAYS } from "@/constants/days";
import { TIME_MAP } from "@/constants/timeslot";
import { toTimeInt } from "@/lib/utils";
import type { RoomRequestStatusType } from "@/constants/room-request-status";

interface AutoDeclineRoomRequestEmailProps {
  classroomName: string;
  date: Date;
  startTime: number;
  endTime: number;
  subject: string;
  section: string;
  responderName: string | null;
  status: RoomRequestStatusType;
}

export const AutoDeclineRoomRequestEmail = ({
  classroomName,
  date,
  startTime,
  endTime,
  subject,
  section,
  responderName,
  status,
}: AutoDeclineRoomRequestEmailProps) => {
  const startTimeStr = TIME_MAP[toTimeInt(startTime)];
  const endTimeStr = TIME_MAP[toTimeInt(endTime)];

  const statusColor =
    status === "accepted" ? "#16a34a" : status === "declined" ? "#dc2626" : "#d97706";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#8A350E",
          color: "white",
          padding: "24px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            display: "inline-block",
            width: "24px",
            textAlign: "center",
            verticalAlign: "middle",
            marginRight: "12px",
          }}
        >
          📢
        </span>
        <div style={{ margin: 0 }}>
          <p
            style={{
              fontSize: "18px", // ✅ control size explicitly
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Room Request Update
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#fcd9c5" }}>
            Room request not accepted
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px" }}>
        <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
          Good Day,
        </p>
        <p
          style={{
            marginTop: "12px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#334155",
          }}
        >
          Your request to borrow <strong> room {classroomName}</strong> for the schedule below has been automatically{" "}
          <strong style={{ color: statusColor }}>declined</strong>. The room owner{" "}
          <strong>{responderName ?? "the approver"}</strong> has approved a request from someone else for the schedule
        </p>

        {/* Request Details */}
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            marginTop: "24px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1e293b",
            }}
          >
            Request Details
          </div>

          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Date:</strong>{" "}
            {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()} (
            {DAYS[date.getDay() - 1]})
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Time:</strong> {startTimeStr} – {endTimeStr}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Subject:</strong> {subject}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Section:</strong> {section}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#64748b",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            marginTop: "24px",
          }}
        >
          <p style={{ margin: 0 }}>
            This is an automated notification from the Scheduling and Resource
            Management System.
          </p>
        </div>
      </div>
    </div>
  );
};
