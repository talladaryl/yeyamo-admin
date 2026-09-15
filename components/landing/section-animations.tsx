"use client";
import { useEffect, useRef, type ReactNode } from "react";
import "./section-animations.css";

export function SectionAnimations({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root.current || !("IntersectionObserver" in window)) return;
    const targets = root.current.querySelectorAll<HTMLElement>(".public-section-heading, .secondary-card, .feature-card, .community-editorial__intro, .community-editorial__cards article, .community-testimonials figure, .faq-item, .app-download__point, .section-heading");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!preference.matches) entry.target.classList.add("section-entered");
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    targets.forEach((target, index) => {
      target.style.setProperty("--entrance-delay", `${(index % 3) * 85}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="section-animation-root">{children}</div>;
}
