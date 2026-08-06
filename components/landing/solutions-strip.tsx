"use client";

import { motion, useReducedMotion } from "framer-motion";
import { solutionItems } from "./data";
import { SectionIcon } from "./section-icon";
import { createRevealVariants } from "../../lib/public/animations";

const revealVariants = createRevealVariants(24);
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

export function SolutionsStrip() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? fadeVariants : revealVariants;

  return (
    <motion.div
      className="content-shell__action-bar"
      id="solutions"
      initial="hidden"
      whileInView="visible"
      custom="up"
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? fadeVariants : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }}
    >
      {solutionItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.article key={item.title} className="action-item" variants={itemVariants} custom="up">
            <SectionIcon icon={Icon} className="action-item__icon" />
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
    </motion.div>
  );
}
