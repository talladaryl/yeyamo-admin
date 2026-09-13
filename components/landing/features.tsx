"use client";

import { usePublicLanguage } from "./public-language";

import { motion, useReducedMotion } from "framer-motion";
import { featureCards } from "./data";
import { SectionIcon } from "./section-icon";
import { SolutionsStrip } from "./solutions-strip";
import { createRevealVariants } from "../../lib/public/animations";

const revealVariants = createRevealVariants(24);
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

function FeatureTile({
  title,
  description,
  icon: Icon,
  reducedMotion
}: {
  title: string;
  description: string;
  icon: typeof featureCards[number]["icon"];
  reducedMotion: boolean;
}) {
  const { t } = usePublicLanguage();
  return (
    <motion.article
      className="tile tile--feature"
      variants={reducedMotion ? fadeVariants : revealVariants}
      custom="up"
    >
      <SectionIcon icon={Icon} className="tile__icon" />
      <div className="tile__copy">
        <h3 className="tile__title">{t(title)}</h3>
        <p className="tile__text">{t(description)}</p>
      </div>
    </motion.article>
  );
}

export function FeaturesSection({ showSolutions = true }: { showSolutions?: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="content-shell" id="features">
      {/** keep the reveal simple on reduced-motion preference */}
      <motion.div
        className="content-shell__panel"
        initial="hidden"
        whileInView="visible"
        custom="up"
        viewport={{ once: true, amount: 0.2 }}
        variants={shouldReduceMotion ? fadeVariants : { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }}
      >
        <div className="content-shell__features">
          {featureCards.map((item) => (
            <FeatureTile key={item.title} {...item} reducedMotion={!!shouldReduceMotion} />
          ))}
        </div>

        {showSolutions && <SolutionsStrip />}
      </motion.div>
    </section>
  );
}
