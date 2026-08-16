"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NAME = "NAHEEL MUHAMMED PK";
const TAGLINE = "Full Stack Developer";

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
      .to(el, {
        opacity: 0,
        duration: 0.5,
        delay: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          sessionStorage.setItem("welcome-seen", "1");
          setShow(false);
        },
      });

    return () => {
      tl.kill();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#09090b" }}
      aria-hidden="true"
    >
      <h1 className="ws-name text-4xl md:text-6xl font-bold text-white tracking-tight opacity-0">
        {NAME}
      </h1>
      <div className="ws-line w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 origin-center" />
      <p className="ws-tagline mt-4 text-xs md:text-sm text-gray-400 tracking-[0.25em] uppercase opacity-0">
        {TAGLINE}
      </p>
    </div>
  );
}
