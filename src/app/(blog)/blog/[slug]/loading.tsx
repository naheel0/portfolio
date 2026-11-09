export default function BlogPostLoading() {
  const skel = (w: string | number, h: number) => ({
    width: w,
    height: h,
    background: "#e8e8dc",
    border: "2px solid #10201d",
    borderRadius: 2,
  });

  return (
    <main className="post-page" aria-busy="true" aria-label="Loading post">
      <div className="post-wrap">
        {/* Back link skeleton */}
        <LinkLoad />

        {/* Header skeleton */}
        <header className="post-header">
          <div style={skel("35%", 56)} />
          <div className="blog-meta" style={{ marginTop: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...skel("40%", 16), marginBottom: 8 }} />
            ))}
          </div>
          <div className="blog-tags" style={{ marginTop: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={skel("80px", 24)} />
            ))}
          </div>
        </header>

        {/* Cover image skeleton */}
        <div style={{ ...skel("100%", 340), marginTop: 32 }} />

        {/* Post body skeleton */}
        <div className="post-body" style={{ marginTop: 32, padding: "36px 40px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...skel("70%", 20), marginBottom: 16 }} />
          ))}
          <div style={skel("45%", 20)} />
        </div>

        {/* Footer skeleton */}
        <footer className="post-footer" style={{ marginTop: 40 }}>
          <div style={skel("40%", 34)} />
        </footer>
      </div>
    </main>
  );
}

function LinkLoad() {
  return (
    <a
      href="/blog"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 17px",
        background: "#e97b77",
        border: "2px solid #10201d",
        boxShadow: "4px 4px 0 #671912",
        color: "#10201d",
        fontFamily: 'var(--font-martian), "Martian Mono", monospace',
        fontSize: "0.95rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
      }}
    >
      <div style={{ width: 15, height: 15, background: "#10201d" }} />
      <div style={{ width: 90, height: 14, background: "#e8e8dc", border: "2px solid #10201d", borderRadius: 2 }} />
    </a>
  );
}
