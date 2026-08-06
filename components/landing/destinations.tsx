"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { destinations } from "./data";
import type { Destination } from "./types";
import { SectionBadge } from "./section-heading";

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <motion.article className="destination-card" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
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

export function DestinationsSection() {
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

  return (
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
  );
}

