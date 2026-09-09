"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { Compass, Home, Menu, MessageCircle, Plus, UserRound } from "lucide-react";
import { useProtectedAction } from "@/features/user-auth/protected-action-context";
import { useUserSession } from "@/features/user-auth/user-session-context";
import { Avatar, IconButton } from "@/components/public/ui";

const publicItems = [{ href: "/", label: "Feed", icon: Home }, { href: "/explorer", label: "Explorer", icon: Compass }];
const protectedItems = [{ href: "/create", label: "Créer", icon: Plus, reason: "Connectez-vous pour créer" }, { href: "/messages", label: "Messages", icon: MessageCircle, reason: "Connectez-vous pour accéder à vos messages" }, { href: "/me", label: "Profil", icon: UserRound, reason: "Connectez-vous pour voir votre profil" }];

export function PublicNavigation({ mode }: { mode: "sidebar" | "rail" | "bottom" }) {
  const pathname = usePathname(); const router = useRouter(); const protectedAction = useProtectedAction(); const { status, session } = useUserSession();
  return <nav className={`yy-nav yy-nav--${mode}`} aria-label="Navigation principale">{mode !== "bottom" ? <Link className="yy-brand" href={"/" as Route}><Image src="/brand/yeyamo-logo.png" width={44} height={44} alt="Yeyamo" /><span>Yeyamo</span></Link> : null}<div className="yy-nav__items">{publicItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href as Route} aria-current={pathname === href ? "page" : undefined}><Icon aria-hidden="true" /><span>{label}</span></Link>)}{protectedItems.map(({ href, label, icon: Icon, reason }) => <button key={href} type="button" aria-current={pathname === href ? "page" : undefined} onClick={() => protectedAction({ reason, level: "L1", run: () => router.push(href as Route) })}><Icon aria-hidden="true" /><span>{label}</span></button>)}</div>{mode === "sidebar" ? <div className="yy-nav__account">{status === "authenticated" && session?.authenticated ? <><Avatar label={session.user.email ?? "Profil"} /><span>{session.user.email ?? "Mon compte"}</span></> : <Link className="yy-login-link" href={"/login" as Route}>Se connecter</Link>}</div> : null}</nav>;
}

export function PublicHeader() { return <header className="yy-public-header"><Link className="yy-brand" href={"/" as Route}><Image src="/brand/yeyamo-logo.png" width={40} height={40} alt="Yeyamo" /><span>Yeyamo</span></Link><IconButton label="Ouvrir le menu"><Menu aria-hidden="true" /></IconButton></header>; }
