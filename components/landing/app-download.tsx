"use client";

import { usePublicLanguage } from "./public-language";
import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { AppDownloadReveal } from "./app-download-reveal";

export interface AppDownloadSectionProps {
  headline: string;
  subheadline: string;
  appStoreUrl: string;
  playStoreUrl: string;
  qrCodeSrc?: string;
}

export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "";

export function isPublishedStoreUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" && (url.hostname === "apps.apple.com" || url.hostname === "play.google.com"); } catch { return false; }
}

export function StoreBadge({ url, store }: { url: string; store: "apple" | "google" }) {
  const { t } = usePublicLanguage();
  const label = store === "apple" ? "Télécharger sur l'App Store" : "Télécharger sur Google Play";
  const published = isPublishedStoreUrl(url);
  const content = <>
    {store === "apple" ? <svg viewBox="16 14 30 34" aria-hidden="true"><path d="M34.2 17.4c-1.6 0-3.6 1.1-4.8 2.8-1.2 1.7-2 4.1-1.6 6.5 2 .1 4-1 5.2-2.8 1.1-1.5 1.9-3.9 1.2-6.5zM34.6 26.3c-2.2-.1-4.1 1.2-5.2 1.2-1.2 0-2.8-1.2-4.6-1.2-2.2 0-4.3 1.3-5.5 3.4-2.3 4-.6 9.9 1.7 13.1 1.1 1.6 2.4 3.3 4.2 3.2 1.7-.1 2.3-1.1 4.4-1.1s2.6 1.1 4.4 1.1c1.8 0 3-1.6 4.1-3.2 1.3-1.9 1.8-3.7 1.8-3.8-.1 0-3.4-1.3-3.5-5.1-.1-3.2 2.6-4.8 2.7-4.9-1.5-2.1-3.8-2.4-4.9-2.5z" fill="currentColor" /></svg>
      : <svg viewBox="0 0 32 36" aria-hidden="true"><path d="M2 2 19 18 2 34Z" fill="#4285f4"/><path d="m2 2 22 12-5 4Z" fill="#34a853"/><path d="m19 18 5 4L2 34Z" fill="#ea4335"/><path d="m24 14 6 3.3a.8.8 0 0 1 0 1.4L24 22l-5-4Z" fill="#fbbc04"/></svg>}
    <span><small>{t(store === "apple" ? "Télécharger sur" : "Disponible sur")}</small><strong>{store === "apple" ? "App Store" : "Google Play"}</strong></span>
  </>;
  return <div className="store-download">
    {published ? <a className="download-store-button" href={url} aria-label={t(label)}>{content}</a>
      : <button className="download-store-button" type="button" disabled aria-label={t(label)}>{content}</button>}
  </div>;
}

export function AppDownloadSection({
  headline,
  subheadline,
  appStoreUrl,
  playStoreUrl,
  qrCodeSrc
}: AppDownloadSectionProps) {
  const { t } = usePublicLanguage();
  return (
    <section className="app-download" id="download" aria-labelledby="download-title">
      <AppDownloadReveal>
        <div className="app-download__panel">
          <div className="app-download__copy">
            <SectionHeading
              id="download-title"
              badge={t("TÉLÉCHARGEMENT")}
              title={t(headline)}
              description={t(subheadline)}
            />

            <div className="app-download__badges" aria-label={t("Badges de téléchargement")}>
              <StoreBadge url={appStoreUrl} store="apple" />
              <StoreBadge url={playStoreUrl} store="google" />
            </div>

            <div className="app-download__points" aria-label={t("Avantages du téléchargement")}>
              <article className="app-download__point">
                <h3>{t("Accès rapide")}</h3>
                <p>{t("Installez YeYamo en quelques secondes et retrouvez vos lieux favoris partout.")}</p>
              </article>
              <article className="app-download__point">
                <h3>{t("Découverte guidée")}</h3>
                <p>{t("L'app met en avant les parcours, les cartes et les contenus utiles au bon moment.")}</p>
              </article>
              <article className="app-download__point">
                <h3>{t("Expérience continue")}</h3>
                <p>{t("Gardez une lecture fluide entre mobile, web et futur support multi-appareils.")}</p>
              </article>
            </div>

            {qrCodeSrc ? (
              <div className="app-download__qr">
                <Image
                  src={qrCodeSrc}
                  alt={t("QR code de téléchargement YeYamo")}
                  width={116}
                  height={116}
                  priority={false}
                  className="app-download__qr-image"
                />
                <p>{t("Scannez pour accéder au téléchargement.")}</p>
              </div>
            ) : null}
          </div>

          <video
            className="app-download__video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={t("Animation vidéo Yamo")}
          >
            <source src="/landing/anim-yamo.mp4" type="video/mp4" />
          </video>
        </div>
      </AppDownloadReveal>
    </section>
  );
}
