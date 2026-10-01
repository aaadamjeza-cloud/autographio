"use client";

import { useEffect } from "react";

// Progressive enhancement: elements with className="reveal" render fully
// visible by default (see .reveal in globals.css). Only once this mounts
// and confirms the visitor doesn't prefer reduced motion do we mark <html>
// with .js-reveal, which is what actually switches them to the
// hidden-until-scrolled-into-view state defined in CSS. No JS / reduced
// motion → content just stays visible, never stuck mid-animation.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("js-reveal");
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
