export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export const createRevealVariants = (distance: number) => ({
  hidden: (direction: RevealDirection) => {
    switch (direction) {
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "up":
        return { opacity: 0, y: distance };
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0
  }
} as const);

export const heroLineStagger = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.03
    }
  }
} as const;

export const heroLineItem = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.99
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
} as const;

export const heroVisualEntrance = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0
  }
} as const;

export const heroHaloMotion = {
  y: [0, -10, 0],
  scale: [1, 1.03, 1]
};

export const heroBadgeMotion = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
} as const;

export const heroTitleMotion = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.03
    }
  }
} as const;

export const heroHeadlineLineMotion = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.99
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
} as const;

export const heroBodyMotion = {
  hidden: {
    opacity: 0,
    y: 14
  },
  visible: {
    opacity: 1,
    y: 0
  }
} as const;

export const heroCtaMotion = {
  hidden: {
    opacity: 0,
    y: 12
  },
  visible: {
    opacity: 1,
    y: 0
  }
} as const;

export const heroMiniBenefitsMotion = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0
  }
} as const;

export const heroVisualMotion = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.985
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
} as const;

export const heroPanelMotion = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0
  }
} as const;

export const heroStripMotion = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0
  }
} as const;

export const heroFloatMotion = {
  y: [0, -8, 0],
  rotate: [0, -1.5, 0]
};
