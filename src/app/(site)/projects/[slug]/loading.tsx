export default function ProjectDetailLoading() {
  const skelBar = (w: string, h = 12) => ({
    height: h,
    width: w,
    borderRadius: 6,
    background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))",
    backgroundSize: "200% 100%" as const,
    animation: "prj-skel-shimmer 1.4s linear infinite",
  });

  return (
    <main className="project-detail" aria-busy="true" aria-label="Loading project">
      <div className="project-detail-inner">
        {/* Hero skeleton */}
        <section className="pd-hero">
          <div className="pd-hero-text">
            <div style={skelBar("100px", 14)} />
            <div style={{ ...skelBar("70%", 32), marginTop: 12 }} />
            <div style={{ marginTop: 16 }}>
              <div style={{ ...skelBar("100%", 12), marginBottom: 8 }} />
              <div style={skelBar("90%", 12)} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <div style={skelBar("120px", 40)} />
              <div style={skelBar("120px", 40)} />
            </div>
          </div>
          <div className="pd-hero-image-wrap">
            <div style={{ ...skelBar("100%", 380), borderRadius: 16 }} />
          </div>
        </section>

        {/* Tech strip skeleton */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "24px 0" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={skelBar("80px", 32)} />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="pd-grid">
          <div className="pd-content">
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ marginBottom: 40 }}>
                <div style={skelBar("180px", 22)} />
                <div style={{ marginTop: 16 }}>
                  <div style={{ ...skelBar("100%", 12), marginBottom: 10 }} />
                  <div style={{ ...skelBar("95%", 12), marginBottom: 10 }} />
                  <div style={skelBar("70%", 12)} />
                </div>
              </div>
            ))}
          </div>
          {/* TOC skeleton */}
          <aside className="pd-toc">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={skelBar(`${60 + i * 10}%`, 14)} />
              ))}
            </div>
          </aside>
        </div>

        <style>{`
          @keyframes prj-skel-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
          @media (prefers-reduced-motion: reduce) { [aria-busy="true"] * { animation: none !important; } }
        `}</style>
      </div>
    </main>
  );
}
