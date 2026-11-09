export default function BlogListLoading() {
  const skel = (w: string | number, h: number) => ({
    width: w,
    height: h,
    background: "#e8e8dc",
    border: "2px solid #10201d",
    borderRadius: 2,
  });

  return (
    <main className="blog-page" aria-busy="true" aria-label="Loading blog">
      <div className="blog-wrap">
        {/* Forest band + back button skeleton */}
        <section className="blog-band" style={{ minHeight: 80 }}>
          <div className="blog-wrap" style={{ display: "flex", alignItems: "center" }}>
            <div style={skel("160px", 34)} />
          </div>
        </section>

        {/* Header + title skeleton */}
        <header className="blog-header" style={{ marginTop: 40 }}>
          <div style={skel("40%", 48)} />
          <div style={{ ...skel("60%", 16), marginTop: 12 }} />
        </header>

        {/* Featured card skeleton */}
        <section className="blog-featured" style={{ marginTop: 48 }}>
          <div style={skel("100%", 220)} />
          <div style={{ padding: "28px 32px 24px" }}>
            <div style={skel("55%", 32)} />
            <div style={{ ...skel("45%", 14), marginTop: 10 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={skel("90px", 24)} />
              ))}
            </div>
          </div>
        </section>

        {/* List rows skeleton */}
        <ul className="blog-list" style={{ marginTop: 40 }}>
          {[1, 2, 3].map((i) => (
            <li key={i} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={skel("176px", 104)} />
                <div style={{ flex: 1 }}>
                  <div style={skel("60%", 24)} />
                  <div style={{ ...skel("50%", 14), marginTop: 10 }} />
                  <div style={{ ...skel("40%", 12), marginTop: 14 }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
