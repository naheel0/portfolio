export default function ResumeLoading() {
  return (
    <div className="resume-page" aria-busy="true" aria-label="Loading resume">
      <div className="resume-container">
        {/* Header skeleton */}
        <div className="resume-header" style={{ marginBottom: 34 }}>
          <div style={{ height: 36, width: "60%", margin: "0 auto 12px", borderRadius: 8, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
          <div style={{ height: 18, width: "30%", margin: "0 auto 18px", borderRadius: 6, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 14, width: 90, borderRadius: 6, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
            ))}
          </div>
        </div>

        {/* Section skeletons */}
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(99,102,241,0.18)" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
              <div style={{ height: 16, width: 140, borderRadius: 6, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
            </div>
            {[1, 2].map((r) => (
              <div key={r} style={{ marginBottom: 16 }}>
                <div style={{ height: 12, width: "100%", borderRadius: 4, marginBottom: 8, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
                <div style={{ height: 12, width: "85%", borderRadius: 4, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
              </div>
            ))}
            {/* Chip row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5].map((c) => (
                <div key={c} style={{ height: 28, width: 70, borderRadius: 50, background: "linear-gradient(90deg, rgba(34,211,238,0.04), rgba(34,211,238,0.08), rgba(34,211,238,0.04))", backgroundSize: "200% 100%", animation: "resume-skel-shimmer 1.4s linear infinite" }} />
              ))}
            </div>
          </div>
        ))}

        <style>{`
          @keyframes resume-skel-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
          @media (prefers-reduced-motion: reduce) { [aria-busy="true"] * { animation: none !important; } }
        `}</style>
      </div>
    </div>
  );
}
