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
            backgroundColor: "#8A350E",
            color: "white",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
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
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "18px", // smaller and consistent
                  fontWeight: "bold",
                }}
              >
                Room Request
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#fcd9c5",
                }}
              >
                {requestorName} is requesting {classroomName}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
            Good day!
          </p>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#334155",
            }}
          >
            <strong>{requestorName}</strong> is requesting to borrow room{" "}
            <strong>{classroomName}</strong> on{" "}
            <strong>
              {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()} (
              {DAYS[date.getDay() - 1]})
            </strong>{" "}
            from <strong>{startTimeStr}</strong> to{" "}
            <strong>{endTimeStr}</strong> for <strong>{subject} - {section}</strong>.
          </p>

          {/* CTA Button */}
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
    </Html>
  );
};
