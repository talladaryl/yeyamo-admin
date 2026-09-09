"use client";

import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle, X } from "lucide-react";

export function Button({ loading, children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return <button className={`yy-button ${className}`} disabled={props.disabled || loading} aria-busy={loading} {...props}>{loading ? <LoaderCircle className="yy-spin" aria-hidden="true" /> : null}{children}</button>;
}
export function IconButton({ label, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button className="yy-icon-button" aria-label={label} {...props}>{children}</button>;
}
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => <input className="yy-input" ref={ref} {...props} />);
Input.displayName = "Input";
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="yy-field"><span>{label}</span>{children}{error ? <FormError>{error}</FormError> : null}</label>; }
export function FormError({ children }: { children: ReactNode }) { return <p className="yy-form-error" role="alert">{children}</p>; }
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`yy-card ${className}`}>{children}</section>; }
export function Avatar({ label }: { label: string }) { return <span className="yy-avatar" aria-label={label}>{label.slice(0, 1).toUpperCase()}</span>; }
export function Badge({ children }: { children: ReactNode }) { return <span className="yy-badge">{children}</span>; }
export function Spinner({ label = "Chargement" }: { label?: string }) { return <span className="yy-spinner" role="status"><LoaderCircle className="yy-spin" aria-hidden="true" /><span className="yy-sr-only">{label}</span></span>; }
export function Skeleton() { return <span className="yy-skeleton" aria-hidden="true" />; }
export function ErrorState({ title, message }: { title: string; message: string }) { return <div className="yy-state" role="alert"><strong>{title}</strong><p>{message}</p></div>; }
export function EmptyState({ title, message }: { title: string; message: string }) { return <div className="yy-state"><strong>{title}</strong><p>{message}</p></div>; }
export function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("button,input,a")?.focus());
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", keydown); returnFocus.current?.focus(); };
  }, [onClose, open]);
  if (!open) return null;
  return <div className="yy-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={panel} className="yy-dialog" role="dialog" aria-modal="true" aria-labelledby="yy-dialog-title"><IconButton label="Fermer" onClick={onClose}><X aria-hidden="true" /></IconButton><h2 id="yy-dialog-title">{title}</h2>{children}</div></div>;
}
export const Sheet = Dialog;
export function Toast({ message }: { message: string }) { return <div className="yy-toast" role="status">{message}</div>; }
