import type { Metadata } from "next";
import { ArtisanDetailPage } from "@/features/culture-market/components/catalog-pages";
export const metadata: Metadata = { title: "Artisan | Yeyamo", description: "Profil public d’un artisan vérifié Yeyamo." };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <ArtisanDetailPage id={(await params).id} />; }
