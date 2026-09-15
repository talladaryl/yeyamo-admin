import Image from "next/image";
import type { PublicPageSlug } from "@/lib/public/pages";
import "./public-hero-background.css";

export function PublicHeroBackground({ page, priority = true }: { page?: PublicPageSlug | "documentation" | "confidentialite"; priority?: boolean }) {
  return <div className={`public-hero-background${page ? " public-hero-background--themed" : ""}`} aria-hidden="true"><Image src={page ? `/backgrounds/${page}.svg` : "/landing/hero-background.webp"} alt="" fill priority={priority} sizes="100vw" /><div /></div>;
}
