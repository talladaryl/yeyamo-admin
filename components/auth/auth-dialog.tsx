"use client";

import { Dialog } from "@/components/public/ui";
import { LoginForm } from "@/components/auth/login-form";

export function AuthDialog({ open, reason, onClose, onAuthenticated }: { open: boolean; reason: string; onClose: () => void; onAuthenticated: () => void }) {
  return <Dialog open={open} title={reason || "Connectez-vous pour continuer"} onClose={onClose}><p className="yy-dialog-lead">Votre contexte sera conservé après la connexion.</p><LoginForm compact onAuthenticated={onAuthenticated} /></Dialog>;
}
