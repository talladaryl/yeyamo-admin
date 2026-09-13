"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { IntroLogo } from "./intro-logo";
import { usePublicLanguage } from "./public-language";
import "./landing-intro.css";

const SESSION_COOKIE = "yeyamo_intro_seen";
const INTRO_EVENT = "yeyamo:intro-dismissed";
let dismissedInMemory = false;

function hasSeenCookie() { return document.cookie.split(";").some((cookie) => cookie.trim() === `${SESSION_COOKIE}=1`); }

function shouldPlayIntro() {
  if (dismissedInMemory || window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try { return !hasSeenCookie(); } catch { return true; }
}

function subscribe(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener(INTRO_EVENT, listener);
  window.addEventListener("hashchange", listener);
  preference.addEventListener("change", listener);
  return () => {
    window.removeEventListener(INTRO_EVENT, listener);
    window.removeEventListener("hashchange", listener);
    preference.removeEventListener("change", listener);
  };
}

function dismissIntro() {
  try {
    document.cookie = `${SESSION_COOKIE}=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    dismissedInMemory = !hasSeenCookie();
  } catch { dismissedInMemory = true; }
  window.dispatchEvent(new Event(INTRO_EVENT));
}

function IntroScreen({ content }: { content: React.RefObject<HTMLDivElement | null> }) {
  const { locale } = usePublicLanguage();
  const logo = useRef<HTMLDivElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);
  const finish = useCallback(() => {
    if (exitTimer.current) return;
    setLeaving(true);
    exitTimer.current = setTimeout(dismissIntro, 280);
  }, []);

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
          const animation = path.animate([
            { strokeDasharray: `${length}`, strokeDashoffset: `${length}`, fillOpacity: 0, strokeOpacity: 1, offset: 0 },
            { strokeDasharray: `${length}`, strokeDashoffset: "0", fillOpacity: 0, strokeOpacity: 1, offset: .65 },
            { strokeDasharray: `${length}`, strokeDashoffset: "0", fillOpacity: 1, strokeOpacity: 0, offset: 1 }
          ], { duration: 1000, delay: group.delay + index * group.stagger, easing: "cubic-bezier(.4,.1,.2,1)", fill: "both" });
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

/** Only wrap the homepage: legal pages and documentation stay directly accessible. */
export function LandingIntro({ children, initiallySeen = false }: { children: ReactNode; initiallySeen?: boolean }) {
  const active = useSyncExternalStore(subscribe, shouldPlayIntro, () => !initiallySeen);
  const content = useRef<HTMLDivElement>(null);
  return <>
    <div ref={content}>{children}</div>
    {active && <IntroScreen content={content} />}
    <noscript><style>{".landing-intro{display:none!important}"}</style></noscript>
  </>;
}
