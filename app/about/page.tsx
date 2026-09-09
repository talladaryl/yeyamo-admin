import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
export const metadata: Metadata = { title: "À propos | Yeyamo", description: "Découvrez la vision et l’application Yeyamo." };
export default function AboutPage() { return <LandingPage />; }
