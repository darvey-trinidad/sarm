interface ReservationUpdateEmailProps {
  venueName: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
}

export function ReservationUpdateEmail({
  venueName,
  date,
  time,
  purpose,
  status,
}: ReservationUpdateEmailProps) {
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
          <span style={{ fontSize: "20px", marginRight: "12px" }}>📢</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              Venue Reservation Update
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              Update for reservation at {venueName}
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
            Your reservation for <i>{purpose}</i> at <strong>{venueName}</strong> {" "}
            on <strong>{date} ({time})</strong> has been <strong>{status}</strong>.
            For more details, please contact the campus admin.
          </p>
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
