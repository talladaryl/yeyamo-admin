import type { Metadata } from "next";
import { PartnerPortalPage } from "@/features/partner-portal/components/partner-portal";
export const metadata: Metadata = { title: "Espace partenaire | Yeyamo", robots: { index: false, follow: false } };
export default function Page() { return <PartnerPortalPage />; }
