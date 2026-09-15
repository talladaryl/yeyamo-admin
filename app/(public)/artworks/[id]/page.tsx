import type { Metadata } from "next";
import { ArtworkDetailPage } from "@/features/culture-market/components/catalog-pages";
export const metadata: Metadata = { title: "Œuvre | Yeyamo", description: "Découvrez une œuvre publiée et son artisan sur Yeyamo." };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <ArtworkDetailPage id={(await params).id} />; }
