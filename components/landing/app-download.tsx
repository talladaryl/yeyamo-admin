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

// TODO: replace with the real App Store URL when YeYamo is published.
export const APP_STORE_URL = "https://example.com/yeyamo-app-store";
// TODO: replace with the real Google Play URL when YeYamo is published.
export const PLAY_STORE_URL = "https://example.com/yeyamo-google-play";

export function AppDownloadSection({
  headline,
  subheadline,
  appStoreUrl,
  playStoreUrl,
  qrCodeSrc
}: AppDownloadSectionProps) {
  return (
    <section className="app-download" id="download" aria-labelledby="download-title">
      <AppDownloadReveal>
        <div className="app-download__panel">
          <div className="app-download__copy">
            <SectionHeading
              id="download-title"
              badge="TÉLÉCHARGEMENT"
              title={headline}
              description={subheadline}
            />

            <div className="app-download__badges" aria-label="Badges de téléchargement">
              <a className="app-download__store-link" href={appStoreUrl} aria-label="Télécharger sur l'App Store">
                <Image
                  src="/brand/app-store-badge.svg"
                  alt="Télécharger sur l'App Store"
                  width={176}
                  height={58}
                  priority={false}
                  className="app-download__badge"
                />
              </a>
              <a className="app-download__store-link" href={playStoreUrl} aria-label="Télécharger sur Google Play">
                <Image
                  src="/brand/google-play-badge.svg"
                  alt="Télécharger sur Google Play"
                  width={176}
                  height={58}
                  priority={false}
                  className="app-download__badge"
                />
              </a>
            </div>

            <div className="app-download__points" aria-label="Avantages du téléchargement">
              <article className="app-download__point">
                <h3>Accès rapide</h3>
                <p>Installez YeYamo en quelques secondes et retrouvez vos lieux favoris partout.</p>
              </article>
              <article className="app-download__point">
                <h3>Découverte guidée</h3>
                <p>L&apos;app met en avant les parcours, les cartes et les contenus utiles au bon moment.</p>
              </article>
              <article className="app-download__point">
                <h3>Expérience continue</h3>
                <p>Gardez une lecture fluide entre mobile, web et futur support multi-appareils.</p>
              </article>
            </div>

            {qrCodeSrc ? (
              <div className="app-download__qr">
                <Image
                  src={qrCodeSrc}
                  alt="QR code de téléchargement YeYamo"
                  width={116}
                  height={116}
                  priority={false}
                  className="app-download__qr-image"
                />
                <p>Scannez pour accéder au téléchargement.</p>
              </div>
            ) : null}
          </div>

          <video
            className="app-download__video"
            suppressHydrationWarning
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Animation vidéo Yamo"
          >
            <source src="/landing/anim-yamo.mp4" type="video/mp4" />
          </video>
        </div>
      </AppDownloadReveal>
    </section>
  );
}
