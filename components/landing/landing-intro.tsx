"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { IntroLogo } from "./intro-logo";
import { usePublicLanguage } from "./public-language";
import "./landing-intro.css";

function subscribeMotion(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
}
function prefersReducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function IntroScreen({ content, onDismiss }: { content: React.RefObject<HTMLDivElement | null>; onDismiss: () => void }) {
  const { locale } = usePublicLanguage();
  const logo = useRef<HTMLDivElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);
  const finish = useCallback(() => {
    if (exitTimer.current) return;
    setLeaving(true);
    exitTimer.current = setTimeout(onDismiss, 280);
  }, [onDismiss]);

  useEffect(() => {
    const page = content.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    if (page) { page.setAttribute("inert", ""); page.setAttribute("aria-hidden", "true"); }
    skipButton.current?.focus({ preventScroll: true });

    const animations: Animation[] = [];
    const completed: Promise<Animation>[] = [];
    try {
      const groups = [
        { selector: "#g-icon path", delay: 80, stagger: 10 },
        { selector: "#g-text path", delay: 880, stagger: 24 },
        { selector: "#g-tagline path", delay: 1700, stagger: 8 }
      ];
      for (const group of groups) {
        logo.current?.querySelectorAll<SVGPathElement>(group.selector).forEach((path, index) => {
          const length = path.getTotalLength();
          const keyframes = group.selector === "#g-icon path" ? [
            { strokeDasharray: `${length}`, strokeDashoffset: `${length}`, fillOpacity: 0, strokeOpacity: 1, offset: 0 },
            { strokeDasharray: `${length}`, strokeDashoffset: "0", fillOpacity: 0, strokeOpacity: 1, offset: .65 },
            { strokeDasharray: `${length}`, strokeDashoffset: "0", fillOpacity: 1, strokeOpacity: 0, offset: 1 }
          ] : [
            { fillOpacity: 0, strokeOpacity: 0 },
            { fillOpacity: 1, strokeOpacity: 0 }
          ];
          const animation = path.animate(keyframes, { duration: 1000, delay: group.delay + index * group.stagger, easing: "cubic-bezier(.4,.1,.2,1)", fill: "both" });
          animations.push(animation);
          completed.push(animation.finished.catch(() => animation));
        });
      }
    } catch {
      logo.current?.querySelectorAll<SVGPathElement>("path").forEach((path) => { path.style.fillOpacity = "1"; path.style.strokeOpacity = "0"; });
    }
    let cancelled = false;
    const hold = setTimeout(() => {
      if (completed.length) void Promise.all(completed).then(() => { if (!cancelled) finish(); }).catch(() => {});
      else finish();
    }, 300);
    // Always unblock the page, even if animation completion never arrives.
    const safety = setTimeout(finish, 4000);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") { event.preventDefault(); skipButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelled = true;
      clearTimeout(hold);
      clearTimeout(safety);
      if (exitTimer.current) { clearTimeout(exitTimer.current); exitTimer.current = null; }
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (page) { page.removeAttribute("inert"); page.removeAttribute("aria-hidden"); }
      const hash = window.location.hash.slice(1);
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else page?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    };
  }, [content, finish]);

  return (
    <div className={`landing-intro${leaving ? " landing-intro--leaving" : ""}`} role="dialog" aria-modal="true" aria-label={locale === "fr" ? "Bienvenue sur YeYamo" : "Welcome to YeYamo"} lang={locale}>
      <span className="landing-intro__eyebrow">{locale === "fr" ? "CHAQUE DÉCOUVERTE COMMENCE ICI" : "EVERY DISCOVERY STARTS HERE"}</span>
      <div className="landing-intro__logo" ref={logo}><IntroLogo /></div>
      <div className="landing-intro__bottom">
        <p>{locale === "fr" ? "L’Afrique vous attend." : "Africa is waiting for you."}</p>
        <button ref={skipButton} type="button" onClick={finish}>{locale === "fr" ? "Passer l’introduction" : "Skip introduction"}<ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

/** Replay on each public page mount, without replaying for in-page navigation. */
export function LandingIntro({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const [dismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => setDismissed(true), []);
  const content = useRef<HTMLDivElement>(null);
  return <>
    <div ref={content}>{children}</div>
    {!dismissed && !reducedMotion && <IntroScreen content={content} onDismiss={dismiss} />}
    <noscript><style>{".landing-intro{display:none!important}"}</style></noscript>
  </>;
}
