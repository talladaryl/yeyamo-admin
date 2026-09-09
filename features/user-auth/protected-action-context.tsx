"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { createL1Intent, isIntentExpired, protectedActionDecision, type AuthIntent, type ProtectedActionLevel } from "@/lib/user-auth/intents";
import { useUserSession } from "@/features/user-auth/user-session-context";

type Request = {
  reason: string;
  level: ProtectedActionLevel;
  intent?: Omit<AuthIntent, "expiresAt" | "nonce" | "next">;
  run: () => void | Promise<void>;
};
type ContextValue = { runProtectedAction: (request: Request) => void };
const Context = createContext<ContextValue | undefined>(undefined);

export function ProtectedActionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { status } = useUserSession();
  const pending = useRef<{ intent?: AuthIntent; run: Request["run"] } | undefined>(undefined);
  const [dialog, setDialog] = useState<{ open: boolean; reason: string }>({ open: false, reason: "" });

  const runProtectedAction = useCallback((request: Request) => {
    const decision = protectedActionDecision(status === "authenticated", request.level);
    if (decision === "RUN") void request.run();
    else if (decision === "CONFIRM_REQUIRED") void request.run();
    else {
      pending.current = {
        intent: request.intent ? createL1Intent({ ...request.intent, next: pathname }) : undefined,
        run: request.run
      };
      setDialog({ open: true, reason: request.reason });
    }
  }, [pathname, status]);

  const authenticated = useCallback(() => {
    const action = pending.current;
    setDialog({ open: false, reason: "" });
    pending.current = undefined;
    if (action && (!action.intent || !isIntentExpired(action.intent))) void action.run();
  }, []);

  return (
    <Context.Provider value={{ runProtectedAction }}>
      {children}
      <AuthDialog open={dialog.open} reason={dialog.reason} onClose={() => setDialog({ open: false, reason: "" })} onAuthenticated={authenticated} />
    </Context.Provider>
  );
}

export function useProtectedAction() {
  const value = useContext(Context);
  if (!value) throw new Error("useProtectedAction doit être utilisé dans ProtectedActionProvider");
  return value.runProtectedAction;
}
