"use client"

import { useEffect, useId, useRef, useState } from "react"

const THEME_VARIABLES: Record<string, string | number | boolean> = {
  fontFamily: "var(--font-ptmono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "13px",
  darkMode: true,
  background: "transparent",
  primaryColor: "#161b22",
  primaryTextColor: "#e6edf3",
  primaryBorderColor: "#58a6ff",
  secondaryColor: "#0d1117",
  secondaryTextColor: "#c9d1d9",
  secondaryBorderColor: "#30363d",
  tertiaryColor: "#161b22",
  tertiaryTextColor: "#e6edf3",
  tertiaryBorderColor: "#30363d",
  lineColor: "#58a6ff",
  textColor: "#8b949e",
  edgeLabelBackground: "#161b22",
  clusterBkg: "#0d1117",
  clusterBorder: "#30363d",
  titleColor: "#e6edf3",
  nodeBorder: "#30363d",
  mainBkg: "#161b22",
  actorBkg: "#161b22",
  signalColor: "#58a6ff",
};

export default function MermaidDiagram({ code }: { code: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || startedRef.current) return;
    startedRef.current = true;

    let disposed = false;
    const render = () => {
      import("mermaid")
        .then((mod) => {
          const mermaid = mod.default;
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            themeVariables: THEME_VARIABLES,
          });
          const id = `pd-mermaid-${uid}`;
          return mermaid.render(id, code);
        })
        .then(({ svg }) => {
          if (disposed) return;
          const host = hostRef.current;
          if (!host) return;
          host.innerHTML = svg;
          const svgEl = host.querySelector("svg");
          if (svgEl) {
            svgEl.setAttribute("role", "img");
            svgEl.setAttribute("aria-label", "Architecture flowchart");
          }
          setLoaded(true);
        })
        .catch(() => {
          if (!disposed) setError(true);
        });
    };

    if (typeof IntersectionObserver === "undefined") {
      render();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setLoaded(false);
          setError(false);
          render();
        }
      },
      { rootMargin: "320px 0px", threshold: 0 }
    );
    io.observe(wrap);
    return () => {
      disposed = true;
      io.disconnect();
    };
  }, [code, uid]);

  return (
    <div className="pd-mermaid-wrap" ref={wrapRef}>
      {!loaded && !error && (
        <div className="pd-mermaid-skeleton" aria-hidden="true">
          <span className="pd-mermaid-skel-bar" />
          <span className="pd-mermaid-skel-bar pd-mermaid-skel-bar-short" />
          <span className="pd-mermaid-skel-bar" />
        </div>
      )}
      <div className="pd-mermaid" ref={hostRef} aria-hidden={!loaded ? "true" : undefined} />
      {error && <p className="pd-mermaid-error">The architecture diagram failed to render.</p>}
    </div>
  );
}