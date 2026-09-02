"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageSquareQuote } from "lucide-react";
import { useEffect, useState } from "react";
import { communityStats, communityTestimonials } from "./data";
import { SectionBadge } from "./section-heading";
import { SectionIcon } from "./section-icon";
import type { Stat } from "./types";

function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className="stat-card">
      <SectionIcon icon={stat.icon} className="stat-card__icon" />
      <strong className="stat-card__value">{stat.value}</strong>
      <p className="stat-card__label">{stat.label}</p>
    </article>
  );
}

export function CommunitySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeTestimonial = communityTestimonials[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion || communityTestimonials.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % communityTestimonials.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion]);

  return (
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
            <Image
              src="/community/avatar-1.png"
              alt="Portrait de Christelle"
              fill
              sizes="42px"
              style={{ objectFit: "cover" }}
            />
          </span>
          <span className="community__avatar">
            <Image
              src="/community/avatar-2.png"
              alt="Portrait de Paul"
              fill
              sizes="42px"
              style={{ objectFit: "cover" }}
            />
          </span>
          <span className="community__avatar">
            <Image
              src="/community/avatar-3.png"
              alt="Portrait de Mireille"
              fill
              sizes="42px"
              style={{ objectFit: "cover" }}
            />
          </span>
          <span className="community__avatar community__avatar--more">+50K</span>
        </div>
        <Link className="button button--primary" href="/admin">
          <span>Rejoindre la communauté</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>

      <article className="testimonial-card" aria-label="Témoignage de la communauté">
        <div className="testimonial-card__avatars" aria-label="Profils du carrousel">
          {communityTestimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              className={`testimonial-card__avatar-button${
                index === activeIndex ? " is-active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir le témoignage de ${testimonial.name}`}
              aria-pressed={index === activeIndex}
            >
              <span className="testimonial-card__avatar">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.avatarAlt}
                  fill
                  sizes="48px"
                  style={{ objectFit: "cover" }}
                />
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial.name}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.4 }}
          >
            <MessageSquareQuote className="testimonial-card__quote" aria-hidden="true" size={44} />
            <p className="testimonial-card__text">{activeTestimonial.quote}</p>
            <div className="testimonial-card__profile">
              <div className="testimonial-card__avatar testimonial-card__avatar--profile">
                <Image
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.avatarAlt}
                  fill
                  sizes="48px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <strong>{activeTestimonial.name}</strong>
                <p>{activeTestimonial.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="testimonial-card__dots" aria-hidden="true">
          {communityTestimonials.map((testimonial, index) => (
            <span key={testimonial.name} className={index === activeIndex ? "is-active" : ""} />
          ))}
        </div>
      </article>

      <div className="stats-grid">
        {communityStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
