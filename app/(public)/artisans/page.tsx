import { Suspense } from "react";
import type { Metadata } from "next";
import { ArtisansPage } from "@/features/culture-market/components/catalog-pages";
export const metadata: Metadata = { title: "Artisans | Yeyamo", description: "Découvrez les artisans vérifiés et leurs œuvres sur Yeyamo." };
export default function Page() { return <Suspense fallback={null}><ArtisansPage /></Suspense>; }


