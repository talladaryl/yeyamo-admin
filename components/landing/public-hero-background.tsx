import Image from "next/image";
import type { PublicPageSlug } from "@/lib/public/pages";
import "./public-hero-background.css";

export function PublicHeroBackground({ page }: { page?: PublicPageSlug | "documentation" | "confidentialite" }) {
  return <div className={`public-hero-background${page ? " public-hero-background--themed" : ""}`} aria-hidden="true"><Image src={page ? `/backgrounds/${page}.svg` : "/landing/hero-background.webp"} alt="" fill priority sizes="100vw" /><div /></div>;
}
