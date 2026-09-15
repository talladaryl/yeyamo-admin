import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/public/ui";
import { PartnerBookingsPage } from "@/features/partner-portal/components/partner-bookings-page";
export const metadata: Metadata = { title: "Réservations partenaire | Yeyamo", robots: { index: false, follow: false } };
export default function Page() { return <Suspense fallback={<Skeleton />}><PartnerBookingsPage /></Suspense>; }
