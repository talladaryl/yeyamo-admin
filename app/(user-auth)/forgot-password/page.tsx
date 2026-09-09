import { ForgotPasswordForm } from "@/components/auth/recovery-forms"; import { Card } from "@/components/public/ui";
export const metadata = { title: "Mot de passe oublié | Yeyamo", robots: { index: false, follow: true } };
export default function Page() { return <Card className="yy-auth-card"><h1>Mot de passe oublié</h1><p>Recevez un code de réinitialisation.</p><ForgotPasswordForm /></Card>; }
