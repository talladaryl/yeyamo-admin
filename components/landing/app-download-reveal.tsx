"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createRevealVariants } from "../../lib/public/animations";

const revealVariants = createRevealVariants(24);
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

export function AppDownloadReveal({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? fadeVariants : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
    >
      <motion.div variants={shouldReduceMotion ? fadeVariants : revealVariants} custom="up">
        {children}
      </motion.div>
    </motion.div>
  );
}
