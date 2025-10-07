// src/emails/account-activated.tsx
interface AccountActivatedEmailProps {
  userName: string;
  loginUrl: string;
}

export function AccountActivatedEmail({
  userName,
  loginUrl,
}: AccountActivatedEmailProps) {
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
          <span style={{ fontSize: "20px", marginRight: "12px" }}>🎉</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              Account Activated!
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#fcd9c5", // lighter tint of brand color
              }}
            >
              Your account is now ready to use
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
            Great news! Your SARM account has been reviewed and activated by our
            administrators. You can now login to the
            Scheduling and Resource Management System.
          </p>
        </div>

        {/* Login Button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <a
            href={loginUrl}
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
            Login to Your Account
          </a>
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
            href={loginUrl}
            style={{
              fontSize: "12px",
              color: "#8A350E",
              wordBreak: "break-all",
            }}
          >
            {loginUrl}
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