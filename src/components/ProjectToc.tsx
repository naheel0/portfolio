"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

const TOC_OFFSET = -15;

export default function ProjectToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: `${TOC_OFFSET}% 0px -68% 0px`, threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));

    const initial = items.find((item) => {
      const el = document.getElementById(item.id);
      return el ? el.getBoundingClientRect().top <= 150 : false;
    });
    if (initial) setActive(initial.id);

    return () => observer.disconnect();
  }, [items]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="pd-toc-inner">
      <span className="pd-toc-label">On this page</span>
      <nav>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`pd-toc-link${active === item.id ? " pd-toc-link-active" : ""}`}
            aria-current={active === item.id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              goTo(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
