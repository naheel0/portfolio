import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="not-found"
      style={{
        minHeight: "60vh",
        backgroundColor: "#161025",
        color: "white",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(3rem, 10vw, 6rem)",
          color: "blueviolet",
          margin: 0,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "20px" }}>
        Page Not Found
      </h2>
      <p
        style={{
          color: "#ccc",
          marginBottom: "30px",
          maxWidth: "500px",
          fontSize: "1.1rem",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-decoration-none"
        style={{
          background: "blueviolet",
          color: "white",
          padding: "12px 30px",
          borderRadius: "8px",
          fontWeight: 600,
          transition: "all 0.3s ease",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
