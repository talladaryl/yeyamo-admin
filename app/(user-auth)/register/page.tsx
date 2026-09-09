import type { Metadata } from "next"; import { RegisterForm } from "@/components/auth/register-form"; import { Card } from "@/components/public/ui";
export const metadata: Metadata = { title: "Créer un compte | Yeyamo", robots: { index: false, follow: true } };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const { next } = await searchParams; return <Card className="yy-auth-card"><h1>Créer un compte</h1><p>Rejoignez Yeyamo sans étape d’onboarding imposée.</p><RegisterForm next={next} /></Card>; }
