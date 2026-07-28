import Link from "next/link";

import "./login.css";

export default function AdminLoginPage() {
  return (
    <main className="admin-login">
      <section className="admin-login__card" aria-labelledby="admin-login-title">
        <div className="admin-login__brand">
          <span className="admin-login__logo">Y</span>
          <div>
            <p className="admin-login__name">YeYamo</p>
            <p className="admin-login__role">Administration</p>
          </div>
        </div>

        <h1 id="admin-login-title" className="admin-login__title">
          Connexion administrateur
        </h1>
        <p className="admin-login__text">
          Accédez à l&apos;espace d&apos;administration YeYamo pour gérer les contenus, les lieux et les partenaires.
        </p>

        <form className="admin-login__form">
          <label>
            <span>Email</span>
            <input type="email" placeholder="admin@yeyamo.cm" />
          </label>
          <label>
            <span>Mot de passe</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="admin-login__submit">
            Se connecter
          </button>
        </form>

        <Link href="/admin" className="admin-login__back">
          Retour au dashboard
        </Link>
      </section>
    </main>
  );
}
