import { Suspense } from "react";
import type { Metadata } from "next";
import { ArtworksPage } from "@/features/culture-market/components/catalog-pages";
export const metadata: Metadata = { title: "Œuvres | Yeyamo", description: "Explorez les œuvres publiées par les artisans Yeyamo." };
export default function Page() { return <Suspense fallback={null}><ArtworksPage /></Suspense>; }
