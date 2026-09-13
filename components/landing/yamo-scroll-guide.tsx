"use client";

import { usePublicLanguage } from "./public-language";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface YamoScrollGuideProps {
  sectionIds: string[];
  className?: string;
}

const YAMO_ALT = "Mascotte Yamo";
const YAMO_WIDTH = 270;
const YAMO_HEIGHT = 338;
const VELOCITY_LIMIT = 1400;

export function YamoScrollGuide({ sectionIds, className }: YamoScrollGuideProps) {
  const { t } = usePublicLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const previousScrollY = useRef(0);
  const idleTimer = useRef<number | null>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [sectionOffsets, setSectionOffsets] = useState<number[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const velocity = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const offsets = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .map((element) => element.getBoundingClientRect().top + window.scrollY);

      setSectionOffsets(offsets);
      setTrackHeight(wrapperRef.current?.clientHeight ?? 0);
    };

    measure();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;

    if (resizeObserver && wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      resizeObserver?.disconnect();
    };
  }, [sectionIds]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - previousScrollY.current;
    previousScrollY.current = latest;
    velocity.set(Math.max(-VELOCITY_LIMIT, Math.min(VELOCITY_LIMIT, delta * 18)));
    setIsScrolling(true);

    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
    }

    idleTimer.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 160);
  });

  const travelDistance = Math.max(0, trackHeight - YAMO_HEIGHT * 0.92);
  const y: MotionValue<number> = useTransform(
    scrollY,
    sectionOffsets.length > 1 ? sectionOffsets : [0, 1],
    sectionOffsets.length > 1
      ? sectionOffsets.map((_, index) => (travelDistance * index) / Math.max(1, sectionOffsets.length - 1))
      : [0, 0]
  );
  const rotate = useTransform(velocity, [-VELOCITY_LIMIT, 0, VELOCITY_LIMIT], [-6, 0, 6]);
  const scale = useTransform(velocity, [-VELOCITY_LIMIT, 0, VELOCITY_LIMIT], [0.95, 1, 1.05]);

  if (shouldReduceMotion) {
    return (
      <Image
        src="/mascot/yamo.png"
        alt={t(YAMO_ALT)}
        width={YAMO_WIDTH}
        height={YAMO_HEIGHT}
        className={`hero-stage__mascot ${className ?? ""}`.trim()}
        priority
      />
    );
  }

  return (
    <motion.div
      ref={wrapperRef}
      className={`hero-stage__scroll-guide ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      <svg
        className="hero-stage__scroll-guide-track"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M20 0V1000" />
        {sectionIds.map((sectionId, index) => {
          const markerPosition = 70 + (index / Math.max(1, sectionIds.length - 1)) * 860;

          return <circle key={sectionId} cx="20" cy={markerPosition} r="4" />;
        })}
      </svg>

      <motion.div
        className="hero-stage__scroll-guide-figure"
        style={{ y, rotate, scale }}
        animate={isScrolling ? undefined : { y: [0, -4, 0] }}
        transition={isScrolling ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="hero-stage__scroll-guide-frame">
          <Image
            src="/mascot/yamo.png"
            alt={t(YAMO_ALT)}
            fill
            sizes="(max-width: 768px) 8rem, (max-width: 1200px) 11rem, 14rem"
            className="hero-stage__scroll-guide-image"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

