export const publicDesignTokens = {
  colors: {
    primary: "#E50914",
    primaryDark: "#B80612",
    primarySoft: "#FFF1F3",
    background: "#FFFFFF",
    backgroundMuted: "#F6F7F9",
    surface: "#FFFFFF",
    surfaceWarm: "#FFF7F5",
    surfaceSoft: "#FFF8F9",
    surfaceMuted: "#F6F7F9",
    surfaceNavy: "#0B1633",
    surfaceNavy2: "#131F42",
    text: "#101827",
    textMuted: "#5B6474",
    border: "rgba(16, 24, 40, 0.08)",
    borderHairline: "#E4E7EC"
  },
  radius: {
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    pill: "999px"
  },
  layout: {
    container: "1400px",
    sectionPaddingY: "clamp(4rem, 8vw, 7rem)",
    sectionGap: "clamp(1.5rem, 3vw, 2.5rem)",
    contentWidth: "72rem"
  },
  hero: {
    textMaxWidth: "42rem",
    visualMinHeight: "clamp(38rem, 54vw, 46rem)",
    floatingCardWidth: "14.5rem",
    floatingCardWidthCompact: "12rem"
  },
  motion: {
    duration: {
      fast: 180,
      base: 240,
      slow: 320
    },
    easing: {
      standard: [0.16, 1, 0.3, 1],
      smooth: [0.22, 1, 0.36, 1]
    },
    distances: {
      subtle: 12,
      base: 18,
      section: 28
    }
  },
  shadows: {
    soft: "0 24px 60px rgba(16, 24, 40, 0.08)",
    card: "0 18px 44px rgba(16, 24, 40, 0.08)",
    hover: "0 18px 36px rgba(229, 9, 20, 0.18)"
  }
} as const;
