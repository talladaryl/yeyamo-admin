"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}

export function TurnstileWidget({ action, onToken }: { action: string; onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const element = useRef<HTMLDivElement>(null);
  const reactId = useId();
  useEffect(() => {
    if (!siteKey || !element.current) return;
    let widgetId: string | undefined;
    const render = () => {
      if (window.turnstile && element.current && !widgetId) widgetId = window.turnstile.render(element.current, { sitekey: siteKey, action, callback: onToken, "expired-callback": () => onToken("") });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-yeyamo-turnstile="true"]');
    if (existing) render();
    else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.yeyamoTurnstile = "true";
      script.onload = render;
      document.head.appendChild(script);
    }
    return () => { if (widgetId) window.turnstile?.remove(widgetId); };
  }, [action, onToken, siteKey]);
  if (!siteKey) return <p className="yy-config-warning" role="status">Connexion indisponible : Turnstile Web n’est pas configuré.</p>;
  return <div id={`turnstile-${reactId}`} ref={element} className="yy-turnstile" />;
}
