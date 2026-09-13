export const publicPages = {
  fonctionnalites: { fr: "Fonctionnalités", en: "Features" },
  solutions: { fr: "Les usages YeYamo", en: "Ways to use YeYamo" },
  profils: { fr: "À chaque profil, son expérience", en: "An experience for every profile" },
  destinations: { fr: "Nos destinations", en: "Our destinations" },
  communaute: { fr: "La communauté YeYamo", en: "The YeYamo community" },
  securite: { fr: "Confiance et sécurité", en: "Trust and security" },
  application: { fr: "YeYamo vous accompagne", en: "Take YeYamo with you" },
  "a-propos": { fr: "Une autre façon de découvrir", en: "A different way to discover" },
  faq: { fr: "Vos questions, nos réponses", en: "Your questions answered" },
  telechargement: { fr: "Retrouvez YeYamo sur mobile", en: "Find YeYamo on mobile" }
} as const;
export type PublicPageSlug = keyof typeof publicPages;
export function isPublicPage(value: string): value is PublicPageSlug { return Object.hasOwn(publicPages, value); }
