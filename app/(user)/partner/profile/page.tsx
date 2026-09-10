import type { Metadata } from "next";
import { PartnerProfilePage } from "@/features/partner-portal/components/partner-portal";
export const metadata: Metadata = { title: "Profil partenaire | Yeyamo", robots: { index: false, follow: false } };
export default function Page() { return <PartnerProfilePage />; }
