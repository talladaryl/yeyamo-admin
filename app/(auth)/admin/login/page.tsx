import Image from "next/image";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";
import "./login.css";

export default function AdminLoginPage() {
  return <main className="admin-login"><section className="admin-login__card" aria-labelledby="admin-login-title"><div className="admin-login__brand"><span className="admin-login__logo"><Image src="/brand/yeyamo-logo.png" alt="YeYamo" width={48} height={48} priority /></span><div><p className="admin-login__name">YeYamo</p><p className="admin-login__role">Administration</p></div></div><h1 id="admin-login-title" className="admin-login__title">Connexion administrateur</h1><p className="admin-login__text">Connectez-vous avec un compte YeYamo disposant d’un rôle d’administration.</p><Suspense><AdminLoginForm /></Suspense></section></main>;
}
