import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(4rem, 12vw, 8rem)",
          fontWeight: 800,
          lineHeight: 1,
          margin: 0,
          background: "linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "#22d3ee",
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
          fontWeight: 700,
          color: "#e2e8f0",
          margin: "16px 0 12px",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          color: "#8b97b8",
          fontSize: "1rem",
          maxWidth: 420,
          lineHeight: 1.7,
          margin: "0 0 32px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          borderRadius: 50,
          background: "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)",
          color: "#060818",
          fontWeight: 700,
          fontSize: "0.95rem",
          textDecoration: "none",
          border: "1px solid rgba(34, 211, 238, 0.5)",
          boxShadow: "0 4px 20px rgba(34, 211, 238, 0.35)",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
        </svg>
        Go Home
      </Link>
    </div>
  );
}
