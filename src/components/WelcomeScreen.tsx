"use client";

import { useEffect, useRef, useState } from "react";

const NAME = "NAHEEL MUHAMMED PK";
const TAGLINE = "Full Stack Developer";
const MIN_DISPLAY_MS = 4000;
const MAX_DISPLAY_MS = 7000;

export default function WelcomeScreen() {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("welcome-seen");
    if (seen) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show || !containerRef.current) return;
    const el = containerRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const t = setTimeout(() => {
        sessionStorage.setItem("welcome-seen", "1");
        setShow(false);
      }, 300);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    let dismissed = false;
    let minTimer: ReturnType<typeof setTimeout>;
    let maxTimer: ReturnType<typeof setTimeout>;
    let cleanup: (() => void) | undefined;

    const dismiss = (gsap: typeof import("gsap").gsap) => {
      if (dismissed) return;
      dismissed = true;
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          sessionStorage.setItem("welcome-seen", "1");
          setShow(false);
        },
      });
    };

    const startTime = Date.now();

    const checkReady = (gsap: typeof import("gsap").gsap) => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= MIN_DISPLAY_MS) dismiss(gsap);
    };

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const onReady = () => {
        setTimeout(() => checkReady(gsap), 100);
      };

      minTimer = setTimeout(() => checkReady(gsap), MIN_DISPLAY_MS);
      maxTimer = setTimeout(() => dismiss(gsap), MAX_DISPLAY_MS);

      if (document.fonts?.ready) {
        document.fonts.ready.then(onReady);
      }
      window.addEventListener("load", onReady);

      cleanup = () => window.removeEventListener("load", onReady);

      const tl = gsap.timeline();

      tl.fromTo(
        el.querySelector(".ws-name"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          el.querySelector(".ws-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          el.querySelector(".ws-tagline"),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          el.querySelector(".ws-spinner"),
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        );
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
      }}
      aria-hidden="true"
    >
      <h1
        className="ws-name opacity-0"
        style={{
          fontSize: "clamp(1.8rem, 5vw, 3.75rem)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.025em",
        }}
      >
        {NAME}
      </h1>
      <div
        className="ws-line origin-center"
        style={{
          width: "4rem",
          height: "1px",
          marginTop: "1rem",
          background: "linear-gradient(to right, transparent, #22d3ee, transparent)",
        }}
      />
      <p
        className="ws-tagline opacity-0"
        style={{
          marginTop: "1rem",
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          color: "#9ca3af",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        {TAGLINE}
      </p>
      <div className="ws-spinner opacity-0" style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: "9999px",
            border: "2px solid #22d3ee",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
