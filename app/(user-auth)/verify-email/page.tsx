import { VerifyEmailForm } from "@/components/auth/recovery-forms"; import { Card } from "@/components/public/ui";
export const metadata = { title: "Vérifier l’email | Yeyamo", robots: { index: false, follow: true } };
export default function Page() { return <Card className="yy-auth-card"><h1>Vérifier votre email</h1><p>Saisissez le code à six chiffres.</p><VerifyEmailForm /></Card>; }
