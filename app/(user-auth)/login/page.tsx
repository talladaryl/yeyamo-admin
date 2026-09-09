import type { Metadata } from "next"; import { LoginForm } from "@/components/auth/login-form"; import { Card } from "@/components/public/ui";
export const metadata: Metadata = { title: "Connexion | Yeyamo", robots: { index: false, follow: true } };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const { next } = await searchParams; return <Card className="yy-auth-card"><h1>Bon retour</h1><p>Connectez-vous pour reprendre votre expérience Yeyamo.</p><LoginForm next={next} /></Card>; }
