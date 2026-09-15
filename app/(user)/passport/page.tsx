import type { Metadata } from "next";
import { PassportPage } from "@/features/passport/components/passport-page";

export const metadata: Metadata = { title: "Mon Passport | Yeyamo", robots: { index: false, follow: false } };

export default function Page() { return <PassportPage />; }
