"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { createRevealVariants } from "../../lib/public/animations";

const revealVariants = createRevealVariants(24);
export function AppDownloadReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
    >
      <motion.div variants={revealVariants} custom="up">
        {children}
      </motion.div>
    </motion.div>
  );
}
