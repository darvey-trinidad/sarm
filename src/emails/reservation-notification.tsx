interface VenueReservationEmailProps {
  venueName: string;
  date: string;
  time: string;
  purpose: string;
}

export function VenueReservationEmail({
  venueName,
  date,
  time,
  purpose,
}: VenueReservationEmailProps) {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        color: "#1e293b", // slate-900
        border: "1px solid #e2e8f0", // slate-200
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#8A350E", // brand color
          color: "white",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "20px", marginRight: "12px" }}>⚠️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              Venue Reservation Alert
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              New reservation at {venueName}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px" }}>
        {/* Greeting */}
        <div>
          <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
            Good day!
          </p>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#334155", // slate-700
            }}
          >
            A new venue reservation has been made for{" "}
            <strong>{venueName}</strong>. The details are provided below in case it conflicts with your schedule.
          </p>
        </div>

        {/* Reservation Details */}
        <div
          style={{
            border: "1px solid #e2e8f0", // slate-200
            borderRadius: "6px",
            marginTop: "24px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1e293b",
            }}
          >
            Reservation Details
          </div>

          {/* Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#fef7f5",
              borderRadius: "6px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "18px", marginRight: "12px" }}>📅</span>
            <div>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8A350E", // brand
                }}
              >
                Date
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#0f172a", // slate-900
                }}
              >
                {date}
              </p>
            </div>
          </div>

          {/* Time */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#fef7f5",
              borderRadius: "6px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "18px", marginRight: "12px" }}>⏰</span>
            <div>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8A350E",
                }}
              >
                Time
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {time}
              </p>
            </div>
          </div>

          {/* Purpose */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "12px",
              backgroundColor: "#fef7f5",
              borderRadius: "6px",
            }}
          >
            <span
              style={{ fontSize: "18px", marginTop: "2px", marginRight: "12px" }}
            >
              📄
            </span>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8A350E",
                }}
              >
                Purpose
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#0f172a",
                  wordBreak: "break-word",
                }}
              >
                {purpose}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#64748b", // slate-500
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            marginTop: "24px",
          }}
        >
          <p style={{ margin: 0 }}>
            This is an automated notification from the Scheduling and Resource Management System.
          </p>
        </div>
      </div>
    </div>
  );
}
