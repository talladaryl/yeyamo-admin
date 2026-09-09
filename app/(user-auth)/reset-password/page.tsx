import { ResetPasswordForm } from "@/components/auth/recovery-forms"; import { Card } from "@/components/public/ui";
export const metadata = { title: "Réinitialiser le mot de passe | Yeyamo", robots: { index: false, follow: true } };
export default function Page() { return <Card className="yy-auth-card"><h1>Réinitialiser</h1><p>Utilisez le code reçu par email.</p><ResetPasswordForm /></Card>; }
