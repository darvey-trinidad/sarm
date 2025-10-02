// src/emails/password-reset.tsx
interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export function PasswordResetEmail({
  userName,
  resetUrl,
}: PasswordResetEmailProps) {
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
          <span style={{ fontSize: "20px", marginRight: "12px" }}>🔐</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              Password Reset Request
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              Reset your account password
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px" }}>
        {/* Greeting */}
        <div>
          <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
            Hi {userName},
          </p>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#334155", // slate-700
            }}
          >
            You requested to reset your password for your SARM account. Click the button below to proceed with resetting your password.
          </p>
        </div>

        {/* Reset Button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <a
            href={resetUrl}
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
            Reset Password
          </a>
        </div>

        {/* Security Info Box */}
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
                This link will expire in 1 hour
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
              style={{ fontSize: "18px", marginTop: "2px", marginRight: "12px" }}
            >
              ⚠️
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
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
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
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <a
            href={resetUrl}
            style={{
              fontSize: "12px",
              color: "#8A350E",
              wordBreak: "break-all",
            }}
          >
            {resetUrl}
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
            This is an automated notification from the Scheduling and Resource Management System.
          </p>
        </div>
      </div>
    </div>
  );
}