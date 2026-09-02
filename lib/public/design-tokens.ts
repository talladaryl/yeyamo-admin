export const publicDesignTokens = {
  colors: {
<<<<<<< HEAD
    primary: "#E50914",
    primaryDark: "#B80612",
    primarySoft: "#FFF1F3",
    background: "#FFFFFF",
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
=======
    primary: "#e50914",
    primaryDark: "#b80612",
    primarySoft: "#fff1f3",
    background: "#ffffff",
    backgroundMuted: "#f6f7f9",
    surfaceWarm: "#fff7f5",
    text: "#101827",
    textMuted: "#5b6474",
    border: "rgba(16, 24, 40, 0.08)",
    borderHairline: "#e4e7ec"
>>>>>>> 000a9bc48fa70ccff4c32dbd753a9ace192fdf38
  },
  radius: {
    sm: "12px",
    md: "16px",
<<<<<<< HEAD
    lg: "20px",
=======
    lg: "24px",
>>>>>>> 000a9bc48fa70ccff4c32dbd753a9ace192fdf38
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
    soft: "0 24px 60px rgba(16, 24, 40, 0.08)",
    card: "0 18px 44px rgba(16, 24, 40, 0.08)",
    hover: "0 18px 36px rgba(229, 9, 20, 0.18)"
  }
} as const;
