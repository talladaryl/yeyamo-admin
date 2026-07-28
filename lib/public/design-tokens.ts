export const publicDesignTokens = {
  colors: {
    primary: "#E30613",
    primaryDark: "#B60410",
    primarySoft: "#FFF1F2",
    background: "#FFFFFF",
    backgroundMuted: "#FAFAFA",
    text: "#171717",
    textMuted: "#667085",
    border: "#E5E7EB"
  },
  radius: {
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "28px",
    pill: "999px"
  },
  layout: {
    container: "1440px",
    sectionPaddingY: "clamp(4rem, 8vw, 7rem)",
    sectionGap: "clamp(1.5rem, 3vw, 2.5rem)",
    contentWidth: "72rem"
  },
  hero: {
    textMaxWidth: "42rem",
    visualMinHeight: "clamp(28rem, 58vw, 44rem)",
    floatingCardWidth: "18rem",
    floatingCardWidthCompact: "15rem"
  },
  motion: {
    duration: {
      fast: 180,
      base: 240,
      slow: 320
    },
    easing: {
      standard: [0.16, 1, 0.3, 1] as const,
      smooth: [0.22, 1, 0.36, 1] as const
    },
    distances: {
      subtle: 12,
      base: 18,
      section: 28
    }
  },
  shadows: {
    soft: "0 10px 30px rgba(23, 23, 23, 0.06)",
    card: "0 16px 40px rgba(23, 23, 23, 0.08)",
    hover: "0 18px 48px rgba(227, 6, 19, 0.12)"
  }
} as const;
