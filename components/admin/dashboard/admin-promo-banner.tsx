import Link from "next/link";
import { Rocket } from "lucide-react";

export function AdminPromoBanner() {
  return (
    <section className="admin-promo-banner">
      <div className="admin-promo-banner__copy">
        <div className="admin-promo-banner__icon">
          <Rocket size={24} strokeWidth={2.1} />
        </div>
        <div>
          <h3 className="admin-promo-banner__title">Boostez la visibilité de YeYamo</h3>
          <p className="admin-promo-banner__text">
            Rejoignez des milliers de partenaires et faites découvrir vos lieux, événements et services.
          </p>
          <Link href="/admin/partners" className="admin-promo-banner__cta">
            En savoir plus
          </Link>
        </div>
      </div>

      <div className="admin-promo-banner__art" aria-hidden="true">
        <svg viewBox="0 0 560 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="promoSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF0F1" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <rect width="560" height="220" fill="url(#promoSky)" />
          <path d="M0 176C76 154 130 110 194 108C257 106 318 143 366 140C426 136 476 99 560 90V220H0Z" fill="#E30613" opacity="0.12" />
          <path d="M0 184C78 166 130 132 189 130C248 128 304 162 355 160C418 157 474 126 560 114V220H0Z" fill="#B0000B" opacity="0.22" />
          <path d="M0 190C72 174 132 152 192 150C255 148 309 172 368 170C432 168 484 150 560 136V220H0Z" fill="#E30613" />
          <circle cx="458" cy="58" r="28" fill="#E30613" opacity="0.85" />
          <path d="M470 74C502 86 526 108 548 144C518 138 492 134 470 138C470 121 470 100 470 74Z" fill="#B0000B" opacity="0.96" />
          <path d="M92 168C112 136 136 118 160 110C154 138 148 170 146 220H92Z" fill="#B0000B" opacity="0.75" />
          <path d="M136 166C154 146 170 132 188 126C185 146 181 170 180 220H136Z" fill="#E30613" opacity="0.7" />
        </svg>
      </div>
    </section>
  );
}
