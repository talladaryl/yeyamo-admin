import Image from "next/image";
import {
  ArrowRight,
  Compass,
  Globe2,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type StripItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type InfoCard = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type FaqItem = {
  question: string;
  answer: string;
};

const navItems: NavItem[] = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Rôles", href: "#roles" },
  { label: "Sécurité", href: "#security" },
  { label: "À propos", href: "#about" },
  { label: "Documentation", href: "#documentation" }
];

const featureItems: FeatureItem[] = [
  {
    title: "Découverte personnalisée",
    description: "Des itinéraires et lieux adaptés à chaque envie, chaque saison et chaque profil.",
    icon: Compass
  },
  {
    title: "Culture et patrimoine",
    description: "Mise en avant des savoir-faire, des traditions et des expériences emblématiques.",
    icon: Globe2
  },
  {
    title: "Communauté locale",
    description: "Des recommandations vivantes, pensées avec et pour les acteurs du terrain.",
    icon: Users
  },
  {
    title: "Expériences authentiques",
    description: "Des moments concrets, utiles et mémorables qui donnent envie de revenir.",
    icon: Sparkles
  }
];

const faqItems: FaqItem[] = [
  {
    question: "Comment YeYamo m'aide à découvrir le Cameroun autrement ?",
    answer:
      "YeYamo met en avant des lieux, parcours et expériences sélectionnés pour leur intérêt culturel, touristique et local. La landing présente la vision, puis l'application aide à explorer plus finement selon vos envies."
  },
  {
    question: "Les recommandations sont-elles personnalisées ?",
    answer:
      "Oui. L'expérience privilégie des suggestions adaptées aux centres d'intérêt, à la zone géographique et au contexte de découverte, pour rester utile et pertinente."
  },
  {
    question: "YeYamo convient-il aux voyageurs comme aux acteurs locaux ?",
    answer:
      "Absolument. La plateforme est pensée pour les visiteurs, les partenaires, les créateurs de contenu et les communautés locales afin de valoriser chaque point de vue."
  },
  {
    question: "Puis-je accéder rapidement au dashboard ?",
    answer:
      "Le bouton d'accès au dashboard est déjà placé dans la navigation. Il renvoie vers l'espace de suivi et d'administration présenté dans la maquette."
  }
];

const stripItems: StripItem[] = [
  {
    title: "Explorer",
    description: "Carte, filtres et accès rapide aux lieux remarquables.",
    icon: Compass
  },
  {
    title: "Partager",
    description: "Avis, récits et médias pour enrichir la communauté.",
    icon: HeartHandshake
  },
  {
    title: "Découvrir",
    description: "Suggestions ciblées et parcours inspirants.",
    icon: Globe2
  },
  {
    title: "Participer",
    description: "Engagement local, événements et contribution terrain.",
    icon: Users
  }
];

const infoCards: InfoCard[] = [
  {
    id: "roles",
    title: "Rôles",
    description: "Guides, créateurs, partenaires et communautés avec des accès adaptés.",
    icon: Users
  },
  {
    id: "security",
    title: "Sécurité",
    description: "Permissions, modération et traçabilité discrète pour chaque action.",
    icon: ShieldCheck
  },
  {
    id: "about",
    title: "À propos",
    description: "YeYamo rassemble la découverte, la confiance et le récit local dans une seule expérience.",
    icon: HeartHandshake
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "Repères pratiques, onboarding et ressources pour aller plus loin.",
    icon: ArrowRight
  }
];

function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" className="section-icon" strokeWidth={1.9} />;
}

function FloatingCard({
  title,
  subtitle,
  value,
  icon: Icon,
  className
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  className: string;
}) {
  return (
    <div className={`floating-card ${className}`}>
      <span className="floating-card__icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="floating-card__copy">
        <p className="floating-card__title">{title}</p>
        <p className="floating-card__subtitle">{subtitle}</p>
      </div>
      <p className="floating-card__value">{value}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="landing-page" id="top">
      <header className="topbar">
        <a className="topbar__brand" href="#top" aria-label="YeYamo - retour en haut de page">
          <Image
            src="/brand/yeyamo-logo.png"
            alt="YeYamo"
            width={56}
            height={56}
            priority
            className="topbar__logo"
          />
          <span className="topbar__wordmark">YeYamo</span>
        </a>

        <nav className="topbar__nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="topbar__nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <a className="topbar__cta" href="#dashboard-preview">
          <ShieldCheck aria-hidden="true" size={18} strokeWidth={2.1} />
          <span>Accéder au dashboard</span>
        </a>
      </header>

      <section className="hero" id="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="hero__badge">DÉCOUVREZ LE CAMEROUN AUTREMENT</span>

            <h1 className="hero__title">
              <span>Explorez le Cameroun</span>
              <span className="hero__title-accent">en toute liberté</span>
            </h1>

            <p className="hero__lead">
              Découvrez des lieux uniques, vivez la culture locale, partagez vos expériences et
              rejoignez une communauté passionnée par le Cameroun.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="#features">
                <span>Explorer maintenant</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
              </a>
              <a className="button button--secondary" href="#about">
                <Play aria-hidden="true" size={18} fill="currentColor" strokeWidth={1.8} />
                <span>Découvrir YeYamo</span>
              </a>
            </div>

            <div className="hero__mini-benefits" id="security">
              <div className="mini-benefit">
                <span className="mini-benefit__icon">
                  <ShieldCheck aria-hidden="true" size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="mini-benefit__title">Accès sécurisé</p>
                  <p className="mini-benefit__text">Rôles et permissions maîtrisés</p>
                </div>
              </div>
              <div className="mini-benefit">
                <span className="mini-benefit__icon">
                  <MapPin aria-hidden="true" size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="mini-benefit__title">Lieux sélectionnés</p>
                  <p className="mini-benefit__text">Recommandations utiles et crédibles</p>
                </div>
              </div>
              <div className="mini-benefit">
                <span className="mini-benefit__icon">
                  <Users aria-hidden="true" size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="mini-benefit__title">Communauté vivante</p>
                  <p className="mini-benefit__text">Échanges, contributions et retours</p>
                </div>
              </div>
              <div className="mini-benefit">
                <span className="mini-benefit__icon">
                  <Sparkles aria-hidden="true" size={18} strokeWidth={2} />
                </span>
                <div>
                  <p className="mini-benefit__title">Expérience fluide</p>
                  <p className="mini-benefit__text">Navigation claire et immersive</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero__visual" id="dashboard-preview" aria-label="Aperçu illustré de l'application YeYamo">
            <div className="hero-stage">
              <div className="hero-stage__glow" aria-hidden="true" />

              <FloatingCard
                className="floating-card--top"
                title="Lieu populaire"
                subtitle="Douala, Kribi et Yaoundé"
                value="Curé par la communauté"
                icon={MapPin}
              />

              <FloatingCard
                className="floating-card--left"
                title="Communauté YeYamo"
                subtitle="Partages vérifiés et retours terrain"
                value="12,8k membres"
                icon={Users}
              />

              <FloatingCard
                className="floating-card--right"
                title="Expérience locale"
                subtitle="Culture, artisanat et itinéraires"
                value="4 min pour explorer"
                icon={Globe2}
              />

              <div className="device-stack">
                <div className="phone-card phone-card--rear" aria-hidden="true">
                  <Image
                    src="/landing/app-mobile-explorer.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 58vw, 18rem"
                    className="device-image"
                  />
                </div>

                <div className="phone-card phone-card--front" aria-hidden="true">
                  <Image
                    src="/landing/app-mobile-home.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 58vw, 18rem"
                    className="device-image"
                  />
                </div>

                <div className="monitor-shell">
                  <div className="monitor-screen">
                    <Image
                      src="/landing/app-dashboard.png"
                      alt="Interface YeYamo du dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 86vw, 50vw"
                      className="device-image"
                    />
                  </div>
                  <div className="monitor-stand" aria-hidden="true">
                    <span className="monitor-stand__stem" />
                    <span className="monitor-stand__base" />
                  </div>
                </div>

                <div className="mascot-cluster">
                  <div className="mascot-halo" aria-hidden="true" />
                  <Image
                    src="/mascot/yamo.png"
                    alt="Mascotte Yamo"
                    width={300}
                    height={375}
                    priority
                    className="mascot"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none">
            <path d="M0 260C108 176 210 132 334 150C470 170 575 248 716 242C857 236 933 155 1063 132C1190 109 1320 165 1440 132V360H0Z" fill="#B9000D" />
            <path d="M0 216C116 170 214 122 356 134C494 146 620 233 737 228C864 222 956 149 1089 121C1219 93 1338 128 1440 98V360H0Z" fill="#E30613" />
            <path d="M0 279C90 240 191 217 306 230C431 246 534 308 655 306C783 304 886 238 998 216C1128 190 1296 214 1440 182V360H0Z" fill="#F8D6D8" />
            <path d="M0 76C106 102 187 150 305 154C430 158 531 100 659 95C801 88 894 151 1024 157C1155 163 1284 103 1440 89V0H0Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      <section className="benefit-panel" id="features">
        <div className="benefit-panel__grid">
          {featureItems.map((item) => (
            <article key={item.title} className="benefit-panel__item">
              <span className="benefit-panel__icon">
                <SectionIcon icon={item.icon} />
              </span>
              <div className="benefit-panel__copy">
                <h2 className="benefit-panel__title">{item.title}</h2>
                <p className="benefit-panel__text">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="strip-anchor" id="solutions">
          <div className="red-strip">
            {stripItems.map((item, index) => (
              <article key={item.title} className="red-strip__item">
                <span className="red-strip__icon">
                  <SectionIcon icon={item.icon} />
                </span>
                <div className="red-strip__copy">
                  <h3 className="red-strip__title">{item.title}</h3>
                  <p className="red-strip__text">{item.description}</p>
                </div>
                {index < stripItems.length - 1 ? <span className="red-strip__divider" aria-hidden="true" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-grid" aria-label="Informations complémentaires">
        {infoCards.map((item) => (
          <article key={item.title} className="info-card" id={item.id}>
            <span className="info-card__icon">
              <SectionIcon icon={item.icon} />
            </span>
            <div className="info-card__copy">
              <h2 className="info-card__title">{item.title}</h2>
              <p className="info-card__text">{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-title">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Questions fréquentes</span>
          <h2 className="section-heading__title" id="faq-title">
            Tout savoir sur l&apos;expérience YeYamo
          </h2>
          <p className="section-heading__text">
            Voici les réponses aux questions les plus utiles avant de découvrir la plateforme.
          </p>
        </div>

        <div className="faq__list">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="faq-item__summary">
                <span>{item.question}</span>
                <span className="faq-item__icon" aria-hidden="true">
                  <ArrowRight size={16} strokeWidth={2.2} />
                </span>
              </summary>
              <div className="faq-item__content">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer__grid">
          <div className="footer__brand">
            <a className="footer__brand-link" href="#top">
              <Image
                src="/brand/yeyamo-logo.png"
                alt="YeYamo"
                width={48}
                height={48}
                className="footer__logo"
              />
              <span>YeYamo</span>
            </a>
            <p className="footer__lead">
              Explorer, partager et valoriser le Cameroun avec une expérience claire, humaine et
              immersive.
            </p>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Navigation</h3>
            <a href="#features">Fonctionnalités</a>
            <a href="#solutions">Solutions</a>
            <a href="#roles">Rôles</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Contact</h3>
            <a href="mailto:hello@yeyamo.cm">
              <Mail size={16} strokeWidth={2} />
              <span>hello@yeyamo.cm</span>
            </a>
            <a href="tel:+237600000000">
              <Phone size={16} strokeWidth={2} />
              <span>+237 600 000 000</span>
            </a>
            <a href="#dashboard-preview">
              <ShieldCheck size={16} strokeWidth={2} />
              <span>Accéder au dashboard</span>
            </a>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">À propos</h3>
            <p className="footer__text">
              Une plateforme pensée pour inspirer la découverte et donner de la visibilité aux
              expériences locales.
            </p>
            <a href="#hero" className="footer__link-cta">
              Retour en haut
              <ArrowRight size={16} strokeWidth={2.1} />
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 YeYamo. Tous droits réservés.</p>
          <div className="footer__bottom-links">
            <a href="#security">Sécurité</a>
            <a href="#about">À propos</a>
            <a href="#documentation">Documentation</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
