// src/emails/verify-email.tsx
interface VerifyEmailProps {
  fullName: string;
  verifyUrl: string;
}

export function VerifyEmail({ fullName, verifyUrl }: VerifyEmailProps) {
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
          <span style={{ fontSize: "20px", marginRight: "12px" }}>✉️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              Email Verification
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              Verify your email address
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px" }}>
        {/* Greeting */}
        <div>
          <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
            Hi {fullName},
          </p>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#334155", // slate-700
            }}
          >
            Thank you for signing up for SARM! Please verify your email address
            to complete your registration and access your account.
          </p>
        </div>

        {/* Verify Button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <a
            href={verifyUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#8A350E",
              color: "white",
              padding: "14px 32px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Verify Email Address
          </a>
        </div>

        {/* Info Box */}
        <div
          style={{
            border: "1px solid #e2e8f0", // slate-200
            borderRadius: "6px",
            padding: "20px",
            backgroundColor: "#fef7f5",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "18px", marginRight: "12px" }}>⏱️</span>
            <div>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8A350E",
                }}
              >
                Link Expiration
              </span>
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                This link will expire in 24 hours
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                marginTop: "2px",
                marginRight: "12px",
              }}
            >
              🔒
            </span>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "13px",
                  color: "#8A350E",
                }}
              >
                Security Notice
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#334155",
                  lineHeight: "1.5",
                }}
              >
                If you didn&apos;t create an account with SARM, you can safely
                ignore this email. No account will be created without
                verification.
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Link */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
          </p>
          <a
            href={verifyUrl}
            style={{
              fontSize: "12px",
              color: "#8A350E",
              wordBreak: "break-all",
            }}
          >
            {verifyUrl}
          </a>
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
            This is an automated notification from the Scheduling and Resource
            Management System.
          </p>
        </div>
      </div>
    </div>
  );
}