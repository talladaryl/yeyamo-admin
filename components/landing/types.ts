import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Destination = {
  title: string;
  region: string;
  category: string;
  rating: string;
  image: string;
  imageAlt: string;
  focalPoint?: string;
};

export type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type AppFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type InfoCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  initials: string;
};
