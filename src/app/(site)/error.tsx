"use client";

export default function SiteError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: 700,
          color: "#e2e8f0",
          margin: "0 0 12px",
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          color: "#8b97b8",
          fontSize: "0.95rem",
          maxWidth: 400,
          lineHeight: 1.7,
          margin: "0 0 28px",
        }}
      >
        An unexpected error occurred. Please try again.
      </p>

      <button
        onClick={reset}
        style={{
          padding: "12px 28px",
          borderRadius: 50,
          background: "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)",
          color: "#060818",
          fontWeight: 700,
          fontSize: "0.95rem",
          border: "1px solid rgba(34, 211, 238, 0.5)",
          boxShadow: "0 4px 20px rgba(34, 211, 238, 0.35)",
          cursor: "pointer",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
