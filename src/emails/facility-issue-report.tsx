import { PageRoutes } from "@/constants/page-routes";
import { env } from "@/env";

interface FacilityIssueReportEmailProps {
  description: string;
  dateReported: Date;
}

export function FacilityIssueReportEmail({
  description,
  dateReported,
}: FacilityIssueReportEmailProps) {
  const formattedDate = dateReported.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = dateReported.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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
              New Facility Issue Report
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              A facility issue has been reported
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
            A new facility issue regarding <strong>{description}</strong> has been reported on{" "}
            <strong>{formattedDate}</strong> at <strong>{formattedTime}</strong>.
          </p>
        </div>

        {/* Action */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#334155", // slate-700
          }}
        >
          Please review and address this issue at your earliest convenience. For
          more details, please visit{" "}
          <a
            href={env.NEXT_PUBLIC_APP_URL + PageRoutes.ISSUES}
            style={{ textDecoration: "underline", color: "#337ab7" }}
          >
            here
          </a>
          .
        </p>

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
            This is an automated notification from the Scheduling and Resource
            Management System.
          </p>
        </div>
      </div>
    </div>
  );
}