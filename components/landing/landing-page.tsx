"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  Heart,
  Landmark,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageSquareQuote,
  MoonStar,
  Play,
  ShieldCheck,
  Sparkles,
  SquareArrowOutUpRight,
  Star,
  Store,
  Users,
  type LucideIcon
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createRevealVariants,
  heroBadgeMotion,
  heroBodyMotion,
  heroCtaMotion,
  heroFloatMotion,
  heroHaloMotion,
  heroMiniBenefitsMotion,
  heroTitleMotion,
  heroVisualMotion
} from "@/lib/public/animations";

type NavItem = {
  label: string;
  href: string;
};

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Destination = {
  title: string;
  region: string;
  category: string;
  rating: string;
  image: string;
  imageAlt: string;
  focalPoint?: string;
};

type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type AppFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
};

const navItems: NavItem[] = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Rôles", href: "#roles" },
  { label: "Sécurité", href: "#security" },
  { label: "À propos", href: "#about" },
  { label: "Documentation", href: "#documentation" }
];

const heroBenefits = [
  {
    title: "Accès sécurisé",
    text: "Données protégées et permissions claires",
    icon: ShieldCheck
  },
  {
    title: "Lieux sélectionnés",
    text: "Recommandations utiles et crédibles",
    icon: MapPin
  },
  {
    title: "Communauté vivante",
    text: "Échanges, contributions et retours",
    icon: Users
  },
  {
    title: "Expérience fluide",
    text: "Navigation claire et immersive",
    icon: Sparkles
  }
] as const;

const featureCards: FeatureCard[] = [
  {
    title: "Découverte personnalisée",
    description: "Des itinéraires et lieux adaptés à chaque envie, chaque saison et chaque profil.",
    icon: Compass
  },
  {
    title: "Culture et patrimoine",
    description: "Mise en avant des savoir-faire, des traditions et des expériences emblématiques.",
    icon: Landmark
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

const solutionItems = [
  {
    title: "Explorer",
    description: "Carte, filtres et accès rapide aux lieux remarquables.",
    icon: LayoutDashboard
  },
  {
    title: "Partager",
    description: "Avis, récits et médias pour enrichir la communauté.",
    icon: Heart
  },
  {
    title: "Découvrir",
    description: "Suggestions ciblées et parcours inspirants.",
    icon: Compass
  },
  {
    title: "Participer",
    description: "Engagement local, événements et contribution terrain.",
    icon: Users
  }
] as const;

const secondaryCards: FeatureCard[] = [
  {
    title: "Rôles",
    description: "Guides, créateurs, partenaires et communautés avec des accès adaptés.",
    icon: Users
  },
  {
    title: "Sécurité",
    description: "Permissions, modération et traçabilité discrète pour chaque action.",
    icon: ShieldCheck
  },
  {
    title: "À propos",
    description: "YeYamo rassemble la découverte, la confiance et le récit local.",
    icon: MoonStar
  },
  {
    title: "Documentation",
    description: "Repères pratiques, onboarding et ressources pour aller plus loin.",
    icon: BookOpen
  }
];

const destinations: Destination[] = [
  {
    title: "Chutes d'Ekom Nkam",
    region: "Ouest",
    category: "Nature",
    rating: "4.8",
    image: "/destinations/chute_ekom.png",
    imageAlt: "Chutes d'Ekom Nkam"
  },
  {
    title: "Kribi",
    region: "Sud",
    category: "Plage",
    rating: "4.6",
    image: "/destinations/kribi.png",
    imageAlt: "Plage de Kribi"
  },
  {
    title: "Palais Royal Bamoun",
    region: "Ouest",
    category: "Culture",
    rating: "4.7",
    image: "/destinations/palais.png",
    imageAlt: "Palais Royal Bamoun"
  },
  {
    title: "Mont Cameroun",
    region: "Sud-Ouest",
    category: "Montagne",
    rating: "4.9",
    image: "/destinations/mont.png",
    imageAlt: "Mont Cameroun"
  }
];

const communityStats: Stat[] = [
  { value: "+50K", label: "Membres actifs", icon: Users },
  { value: "+200", label: "Destinations", icon: MapPin },
  { value: "+15K", label: "Avis & partages", icon: MessageSquareQuote },
  { value: "24/7", label: "Support disponible", icon: Bell }
];

const appFeatures: AppFeature[] = [
  {
    title: "Interface intuitive",
    description: "Navigation simple et agréable pour aller vite sans perdre la richesse du contenu.",
    icon: LayoutDashboard
  },
  {
    title: "Notifications intelligentes",
    description: "Restez informé en temps réel des nouveautés, suggestions et événements utiles.",
    icon: Bell
  },
  {
    title: "Mode hors ligne",
    description: "Accédez aux contenus utiles quand la connexion est limitée ou instable.",
    icon: SquareArrowOutUpRight
  },
  {
    title: "Sécurité et fiabilité",
    description: "Vos données sont protégées et les échanges restent encadrés.",
    icon: ShieldCheck
  }
];

const testimonials: Testimonial[] = [
  {
    quote:
      "YeYamo m'a permis de découvrir des endroits incroyables et de rencontrer des gens formidables. Une application incontournable !",
    name: "Christelle M.",
    role: "Voyageuse passionnée",
    avatar: "/community/avatar-1.png",
    avatarAlt: "Portrait de Christelle"
  },
  {
    quote:
      "Le slider met vraiment en valeur la communauté et donne envie d'explorer davantage le Cameroun.",
    name: "Paul T.",
    role: "Guide local",
    avatar: "/community/avatar-2.png",
    avatarAlt: "Portrait de Paul"
  },
  {
    quote:
      "Les expériences locales sont mieux mises en avant, et les témoignages rendent tout plus humain.",
    name: "Mireille A.",
    role: "Créatrice de contenu",
    avatar: "/community/avatar-3.png",
    avatarAlt: "Portrait de Mireille"
  }
] as const;

const faqItems = [
  {
    question: "Comment YeYamo m'aide à découvrir le Cameroun autrement ?",
    answer:
      "YeYamo met en avant des lieux, parcours et expériences sélectionnés pour leur intérêt culturel, touristique et local."
  },
  {
    question: "Les recommandations sont-elles personnalisées ?",
    answer:
      "Oui, la plateforme privilégie des suggestions adaptées aux centres d'intérêt, à la zone géographique et au contexte de découverte."
  },
  {
    question: "YeYamo convient-il aux voyageurs comme aux acteurs locaux ?",
    answer:
      "Absolument. La plateforme est pensée pour les visiteurs, les partenaires, les créateurs de contenu et les communautés locales."
  },
  {
    question: "Puis-je accéder rapidement au dashboard ?",
    answer:
      "Le bouton d'accès au dashboard reste présent dans la navigation et dans les appels à l'action principaux."
  }
] as const;

const socialItems = [
  { label: "Facebook", short: "f" },
  { label: "Instagram", short: "ig" },
  { label: "YouTube", short: "yt" },
  { label: "X", short: "x" },
  { label: "TikTok", short: "tt" }
] as const;

const cardReveal = createRevealVariants(24);
const reducedFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.16 } }
};

function SectionBadge({ children }: { children: string }) {
  return <span className="section-badge">{children}</span>;
}

function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  id
}: {
  badge: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <SectionBadge>{badge}</SectionBadge>
      <h2 className="section-heading__title" id={id}>
        {title}
      </h2>
      <p className="section-heading__text">{description}</p>
    </div>
  );
}

function FeatureTile({ title, description, icon: Icon }: FeatureCard) {
  return (
    <motion.article className="tile tile--feature" variants={cardReveal}>
      <span className="tile__icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="tile__copy">
        <h3 className="tile__title">{title}</h3>
        <p className="tile__text">{description}</p>
      </div>
    </motion.article>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <motion.article className="destination-card" variants={cardReveal}>
      <div className="destination-card__scene">
        <Image
          src={destination.image}
          alt={destination.imageAlt}
          fill
          sizes="(max-width: 768px) 70vw, 15rem"
          className="destination-card__image"
          style={{ objectPosition: destination.focalPoint ?? "center center" }}
        />
        <div className="destination-card__overlay" />
        <span className="destination-card__pill">{destination.category}</span>
        <span className="destination-card__rating">
          <Star aria-hidden="true" size={13} fill="currentColor" />
          {destination.rating}
        </span>
      </div>
      <div className="destination-card__copy">
        <h3 className="destination-card__title">{destination.title}</h3>
        <p className="destination-card__region">{destination.region}</p>
      </div>
    </motion.article>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  return (
    <article className="stat-card">
      <span className="stat-card__icon">
        <Icon aria-hidden="true" />
      </span>
      <strong className="stat-card__value">{stat.value}</strong>
      <p className="stat-card__label">{stat.label}</p>
    </article>
  );
}

function AppFeatureRow({ title, description, icon: Icon }: AppFeature) {
  return (
    <li className="app-feature">
      <span className="app-feature__icon">
        <Icon aria-hidden="true" />
      </span>
      <div>
        <h3 className="app-feature__title">{title}</h3>
        <p className="app-feature__text">{description}</p>
      </div>
    </li>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card" aria-label={`Témoignage de ${testimonial.name}`}>
      <MessageSquareQuote className="testimonial-card__quote" aria-hidden="true" size={44} />
      <p className="testimonial-card__text">{testimonial.quote}</p>
      <div className="testimonial-card__profile">
        <div className="testimonial-card__avatar">
          <Image src={testimonial.avatar} alt={testimonial.avatarAlt} fill sizes="64px" />
        </div>
        <div>
          <strong>{testimonial.name}</strong>
          <p>{testimonial.role}</p>
        </div>
      </div>
      <div className="testimonial-card__dots" aria-hidden="true">
        {testimonials.map((item) => (
          <span key={item.name} className={item.name === testimonial.name ? "is-active" : ""} />
        ))}
      </div>
    </article>
  );
}

function FloatingCard({
  title,
  subtitle,
  value,
  icon: Icon,
  className,
  reducedMotion
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  className: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className={`floating-card ${className}`}
      animate={reducedMotion ? undefined : heroFloatMotion}
      transition={reducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="floating-card__icon">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div className="floating-card__copy">
        <p className="floating-card__title">{title}</p>
        <p className="floating-card__subtitle">{subtitle}</p>
      </div>
      <p className="floating-card__value">{value}</p>
    </motion.div>
  );
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const destinationsRailRef = useRef<HTMLDivElement | null>(null);

  const scrollDestinations = (direction: "left" | "right") => {
    const rail = destinationsRailRef.current;

    if (!rail) {
      return;
    }

    const distance = rail.clientWidth * 0.82;
    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const rail = destinationsRailRef.current;

      if (!rail) {
        return;
      }

      const distance = rail.clientWidth * 0.82;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth - 2;
      const nextScrollLeft = rail.scrollLeft + distance;

      if (nextScrollLeft >= maxScrollLeft) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      rail.scrollBy({ left: distance, behavior: "smooth" });
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || testimonials.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion]);

  return (
    <main className="landing-page" id="top">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__brand" href="#top" aria-label="YeYamo - retour en haut de page">
            <Image
              src="/brand/yeyamo-logo.png"
              alt="YeYamo"
              width={54}
              height={54}
              priority
              className="site-header__brand-mark"
            />
            <span className="site-header__brand-name">YeYamo</span>
          </a>

          <nav className="site-header__nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="site-header__nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link className="site-header__cta" href="/admin">
              <ShieldCheck aria-hidden="true" size={18} strokeWidth={2.2} />
              <span>Accéder au dashboard</span>
            </Link>

            <button
              type="button"
              className="site-header__menu"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              {mobileMenuOpen ? <ChevronDown aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              className="site-header__drawer"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.2 }}
            >
              <div className="site-header__drawer-links">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="site-header__drawer-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <Link className="site-header__drawer-cta" href="/admin">
                Accéder au dashboard
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <section className="hero" aria-label="Présentation de YeYamo">
        <div className="hero__inner">
          <motion.div
            className="hero__copy"
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            variants={shouldReduceMotion ? reducedFade : heroTitleMotion}
          >
            <motion.span className="hero__badge" variants={shouldReduceMotion ? reducedFade : heroBadgeMotion}>
              DÉCOUVREZ LE CAMEROUN AUTREMENT
            </motion.span>

            <motion.h1 className="hero__title" variants={shouldReduceMotion ? reducedFade : heroTitleMotion}>
              <span>Explorez le Cameroun</span>
              <span className="hero__title-accent">en toute liberté</span>
            </motion.h1>

            <motion.p className="hero__lead" variants={shouldReduceMotion ? reducedFade : heroBodyMotion}>
              Découvrez des lieux uniques, vivez la culture locale, partagez vos expériences et
              rejoignez une communauté passionnée par le Cameroun.
            </motion.p>

            <motion.div className="hero__actions" variants={shouldReduceMotion ? reducedFade : heroCtaMotion}>
          <a className="button button--primary" href="#features">
                <span>Explorer maintenant</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
              </a>
              <a className="button button--secondary" href="#about">
                <Play aria-hidden="true" size={17} fill="currentColor" strokeWidth={1.8} />
                <span>Découvrir YeYamo</span>
              </a>
            </motion.div>

            <motion.div className="hero__benefits" variants={shouldReduceMotion ? reducedFade : heroMiniBenefitsMotion}>
              {heroBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article key={benefit.title} className="hero-benefit">
                    <span className="hero-benefit__icon">
                      <Icon aria-hidden="true" size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <h2 className="hero-benefit__title">{benefit.title}</h2>
                      <p className="hero-benefit__text">{benefit.text}</p>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            aria-label="Aperçu de l'application YeYamo"
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? reducedFade : heroVisualMotion}
          >
            <div className="hero-stage">
              <div className="hero-stage__backdrop" aria-hidden="true" />
              <FloatingCard
                className="floating-card--community"
                title="Communauté YeYamo"
                subtitle="Partages, vérifiés et retours terrain"
                value="12,8k membres"
                icon={Users}
                reducedMotion={!!shouldReduceMotion}
              />
              <FloatingCard
                className="floating-card--local"
                title="Expérience locale"
                subtitle="Culture, artisanat et itinéraires"
                value="4 min pour explorer"
                icon={Store}
                reducedMotion={!!shouldReduceMotion}
              />
              <FloatingCard
                className="floating-card--popular"
                title="Lieu populaire"
                subtitle="Douala, Kribi et Yaoundé"
                value="Créé par la communauté"
                icon={MapPin}
                reducedMotion={!!shouldReduceMotion}
              />

              <motion.div
                className="hero-stage__dashboard"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08 }}
              >
                <div className="hero-stage__dashboard-screen">
                  <Image
                    src="/landing/app-dashboard.png"
                    alt="Tableau de bord YeYamo"
                    fill
                    priority
                    sizes="(max-width: 1100px) 92vw, 50vw"
                    className="hero-stage__image"
                  />
                </div>
              </motion.div>

              <motion.div
                className="hero-stage__phone hero-stage__phone--left"
                initial={shouldReduceMotion ? false : { opacity: 0, rotate: -10, x: -16, y: 20 }}
                animate={{ opacity: 1, rotate: -12, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.12 }}
              >
                <div className="hero-stage__phone-frame">
                  <Image
                    src="/landing/app-mobile-home.png"
                    alt="Écran d'accueil mobile YeYamo"
                    fill
                    priority
                    sizes="(max-width: 768px) 40vw, 18rem"
                    className="hero-stage__image"
                  />
                </div>
              </motion.div>

              <motion.div
                className="hero-stage__phone hero-stage__phone--right"
                initial={shouldReduceMotion ? false : { opacity: 0, rotate: 11, x: 18, y: 18 }}
                animate={{ opacity: 1, rotate: 9, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.18 }}
              >
                <div className="hero-stage__phone-frame">
                  <Image
                    src="/landing/app-mobile-explorer.png"
                    alt="Écran d'exploration mobile YeYamo"
                    fill
                    priority
                    sizes="(max-width: 768px) 40vw, 18rem"
                    className="hero-stage__image"
                  />
                </div>
              </motion.div>

              <motion.div
                className="hero-stage__halo hero-stage__halo--left"
                aria-hidden="true"
                animate={shouldReduceMotion ? undefined : heroHaloMotion}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="hero-stage__halo hero-stage__halo--right"
                aria-hidden="true"
                animate={shouldReduceMotion ? undefined : heroHaloMotion}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              <Image
                src="/mascot/yamo.png"
                alt="Mascotte Yamo"
                width={270}
                height={338}
                className="hero-stage__mascot"
                priority
              />
            </div>
          </motion.div>
        </div>

        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 280" preserveAspectRatio="none">
            <path d="M0 155C104 92 214 58 334 69C470 82 573 155 715 148C856 141 945 67 1070 46C1188 26 1320 62 1440 37V280H0Z" fill="rgba(255,244,245,0.9)" />
            <path d="M0 182C106 118 230 93 348 106C465 119 560 177 711 171C867 165 932 82 1062 63C1189 45 1327 82 1440 55V280H0Z" fill="#e0151f" />
            <path d="M0 206C100 169 194 158 296 170C425 186 542 248 671 241C812 234 893 171 1008 154C1152 133 1296 168 1440 141V280H0Z" fill="#b80612" />
          </svg>
        </div>
      </section>

      <section className="content-shell" id="features">
        <motion.div
          className="content-shell__panel"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 26 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          <div className="content-shell__features">
            {featureCards.map((item) => (
              <FeatureTile key={item.title} {...item} />
            ))}
          </div>

          <div className="content-shell__action-bar" id="solutions">
            {solutionItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  className="action-item"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={shouldReduceMotion ? reducedFade : cardReveal}
                  custom="up"
                  transition={{ delay: index * 0.08 }}
                >
                  <span className="action-item__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="action-item__copy">
                    <h3 className="action-item__title">{item.title}</h3>
                    <p className="action-item__text">{item.description}</p>
                  </div>
                  {index < solutionItems.length - 1 ? (
                    <span className="action-item__divider" aria-hidden="true" />
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        <div className="secondary-grid">
          {secondaryCards.map((item, index) => (
            <motion.article
              key={item.title}
              className="secondary-card"
              id={
                item.title === "Rôles"
                  ? "roles"
                  : item.title === "Sécurité"
                    ? "security"
                    : item.title === "À propos"
                      ? "about"
                      : "documentation"
              }
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={shouldReduceMotion ? reducedFade : cardReveal}
              custom="up"
              transition={{ delay: index * 0.08 }}
            >
              <span className="secondary-card__icon">
                <item.icon aria-hidden="true" />
              </span>
              <div className="secondary-card__copy">
                <h3 className="secondary-card__title">{item.title}</h3>
                <p className="secondary-card__text">{item.description}</p>
              </div>
              <ChevronRight aria-hidden="true" className="secondary-card__arrow" size={17} />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="destinations" aria-labelledby="destinations-title">
        <div className="destinations__intro">
          <SectionBadge>DESTINATIONS POPULAIRES</SectionBadge>
          <h2 className="destinations__title" id="destinations-title">
            Explorer les <span>merveilles</span> du Cameroun
          </h2>
          <p className="destinations__text">
            Des montagnes majestueuses aux plages paradisiaques, en passant par des villes
            vibrantes et une culture riche.
          </p>
          <a className="button button--primary" href="#community">
            <span>Voir toutes les destinations</span>
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>

        <div className="destinations__rail-shell">
          <div className="destinations__controls" aria-label="Contrôles du carrousel">
            <button
              type="button"
              className="destinations__control"
              onClick={() => scrollDestinations("left")}
              aria-label="Voir les destinations précédentes"
            >
              <ChevronRight aria-hidden="true" size={18} className="is-left" />
            </button>
            <button
              type="button"
              className="destinations__control"
              onClick={() => scrollDestinations("right")}
              aria-label="Voir les destinations suivantes"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>

          <div
            className="destinations__rail"
            ref={destinationsRailRef}
            aria-label="Carrousel des destinations populaires"
          >
            {destinations.map((destination) => (
              <DestinationCard key={destination.title} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="community" id="community" aria-labelledby="community-title">
        <div className="community__intro">
          <SectionBadge>COMMUNAUTÉ</SectionBadge>
          <h2 className="community__title" id="community-title">
            Partagez. Apprenez. Inspirez.
          </h2>
          <p className="community__text">
            Des milliers de Camerounais partagent chaque jour leurs découvertes, conseils et bons
            plans.
          </p>
          <div className="community__avatars" aria-label="Membres actifs">
            <span className="community__avatar">
              <Image src="/community/avatar-1.png" alt="Portrait de Christelle" fill sizes="42px" />
            </span>
            <span className="community__avatar">
              <Image src="/community/avatar-2.png" alt="Portrait de Paul" fill sizes="42px" />
            </span>
            <span className="community__avatar">
              <Image src="/community/avatar-3.png" alt="Portrait de Mireille" fill sizes="42px" />
            </span>
            <span className="community__avatar community__avatar--more">+50K</span>
          </div>
          <Link className="button button--primary" href="#download">
            <span>Rejoindre la communauté</span>
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[testimonialIndex].name}
            initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.45 }}
          >
            <TestimonialCard testimonial={testimonials[testimonialIndex]} />
          </motion.div>
        </AnimatePresence>

        <div className="stats-grid">
          {communityStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section className="app-showcase" id="app-showcase" aria-labelledby="app-showcase-title">
        <div className="app-showcase__copy">
          <SectionHeading
            id="app-showcase-title"
            badge="MULTI-APPAREILS"
            title={
              <>
                Une expérience fluide <span>sur tous vos appareils</span>
              </>
            }
            description="YeYamo est disponible sur mobile et bientôt sur tablette et web pour vous suivre partout."
          />

          <div className="store-buttons">
            <a href="#app-showcase" className="store-button" aria-label="Télécharger sur Google Play">
              <span className="store-button__label">Disponible sur</span>
              <strong>Google Play</strong>
            </a>
            <a href="#app-showcase" className="store-button" aria-label="Télécharger sur l'App Store">
              <span className="store-button__label">Télécharger sur</span>
              <strong>l&apos;App Store</strong>
            </a>
          </div>
        </div>

        <div className="app-showcase__devices" aria-label="Aperçu multi-appareils">
          <div className="app-showcase__device app-showcase__device--rear">
            <Image
              src="/landing/app-mobile-explorer.png"
              alt="Exploration mobile YeYamo"
              fill
              sizes="(max-width: 768px) 38vw, 14rem"
              className="hero-stage__image"
            />
          </div>
          <div className="app-showcase__device app-showcase__device--front">
            <Image
              src="/landing/app-mobile-home.png"
              alt="Accueil mobile YeYamo"
              fill
              sizes="(max-width: 768px) 38vw, 14rem"
              className="hero-stage__image"
            />
          </div>
          <div className="app-showcase__tablet">
            <Image
              src="/landing/app-dashboard.png"
              alt="Dashboard YeYamo"
              fill
              sizes="(max-width: 1100px) 90vw, 36vw"
              className="hero-stage__image"
            />
          </div>
        </div>

        <ul className="app-features" aria-label="Avantages de l'application">
          {appFeatures.map((item) => (
            <AppFeatureRow key={item.title} {...item} />
          ))}
        </ul>
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-title">
        <SectionHeading
          id="faq-title"
          badge="FAQ"
          title={
            <>
              Questions <span>fréquentes</span>
            </>
          }
          description="Voici les réponses aux questions les plus utiles avant de découvrir la plateforme."
        />

        <div className="faq__list">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="faq-item__summary">
                <span>{item.question}</span>
                <ChevronRight aria-hidden="true" size={16} className="faq-item__icon" />
              </summary>
              <div className="faq-item__content">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta" aria-label="Appel à l'action final">
        <div className="final-cta__art" aria-hidden="true">
          <div className="final-cta__sun" />
          <div className="final-cta__wave" />
          <Image
            src="/mascot/yamo.png"
            alt=""
            width={250}
            height={314}
            className="final-cta__mascot"
          />
        </div>

        <div className="final-cta__copy">
          <h2>Prêt à explorer le Cameroun autrement ?</h2>
          <p>Rejoignez YeYamo et vivez des expériences uniques dès aujourd&apos;hui.</p>

          <form className="final-cta__form">
            <label className="final-cta__field">
              <span className="sr-only">Adresse email</span>
              <input
                type="email"
                name="email"
                placeholder="Votre adresse email"
                aria-label="Votre adresse email"
              />
            </label>
            <button type="submit" className="final-cta__newsletter">
              S&apos;inscrire à la newsletter
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a className="site-footer__brand-link" href="#top">
              <Image
                src="/brand/yeyamo-logo.png"
                alt="YeYamo"
                width={48}
                height={48}
                className="site-footer__brand-mark"
              />
              <span>YeYamo</span>
            </a>
            <p className="site-footer__lead">
              Explorer, partager et valoriser le Cameroun avec une expérience claire, humaine et
              immersive.
            </p>

            <div className="site-footer__socials" aria-label="Réseaux sociaux">
              {socialItems.map((item) => (
                <a key={item.label} href="#top" className="site-footer__social">
                  <span>{item.short}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__column">
            <h3>Navigation</h3>
            <a href="#features">Fonctionnalités</a>
            <a href="#solutions">Solutions</a>
            <a href="#roles">Rôles</a>
            <a href="#security">Sécurité</a>
            <a href="#about">À propos</a>
            <a href="#documentation">Documentation</a>
          </div>

          <div className="site-footer__column">
            <h3>Ressources</h3>
            <Link href="/">Guides</Link>
            <Link href="/">Blog</Link>
            <a href="#documentation">Documentation</a>
            <Link href="/">FAQ</Link>
          </div>

          <div className="site-footer__column">
            <h3>Contact</h3>
            <a href="mailto:hello@yeyamo.cm">hello@yeyamo.cm</a>
            <a href="tel:+237600000000">+237 600 000 000</a>
            <Link href="/">Yaoundé, Cameroun</Link>
          </div>

          <div className="site-footer__column site-footer__column--about">
            <h3>À propos</h3>
            <p>
              Une plateforme pensée pour inspirer la découverte et donner de la visibilité aux
              expériences locales.
            </p>
            <a href="#top" className="site-footer__backtop">
              Retour en haut
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 YeYamo. Tous droits réservés.</p>
          <div className="site-footer__bottom-links">
            <a href="#security">Sécurité</a>
            <a href="#about">À propos</a>
            <a href="#documentation">Documentation</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
