# Architecture de la Landing Page et du Dashboard YeYamo Admin

## 1. Objet du document

Ce document décrit précisément les deux parties principales du projet `yeyamo-admin` :

1. la **landing page publique**, disponible à la route `/` ;
2. le **dashboard d’administration**, disponible sous `/admin`.

Il explique leur structure, leurs composants, leurs styles, leur routage, leur sécurité, leur accès aux API et les conventions à respecter pour les faire évoluer sans casser l’existant.

---

## 2. Vue générale du projet

Le projet repose sur :

- Next.js 15 avec App Router ;
- React 19 ;
- TypeScript strict ;
- TanStack Query pour les données asynchrones ;
- Zod pour les formulaires métier ;
- Lucide React pour les icônes ;
- Recharts pour les graphiques ;
- Mapbox GL pour les fonctionnalités cartographiques administratives ;
- `fetch` natif via un client centralisé ;
- cookies HttpOnly pour la session administrateur ;
- proxy Next.js sécurisé vers l’API Gateway YeYamo.

Arborescence fonctionnelle simplifiée :

```text
yeyamo-admin/
├── app/
│   ├── page.tsx                         # Landing page publique
│   ├── layout.tsx                       # Layout racine et polices
│   ├── providers.tsx                    # Query, session et toasts
│   ├── globals.css                      # Styles publics globaux
│   ├── (auth)/admin/login/              # Connexion administrateur
│   ├── (dashboard)/admin/               # Toutes les routes admin
│   └── api/
│       ├── auth/                         # BFF auth Next.js
│       └── backend/[...path]/            # Proxy vers API Gateway
├── components/
│   ├── admin/                            # UI et widgets admin communs
│   ├── admin-shell.tsx                   # Coquille du dashboard
│   ├── sidebar.tsx                       # Navigation latérale RBAC
│   └── topbar.tsx                        # Barre supérieure admin
├── features/                             # Modules métier admin
├── lib/
│   ├── api/                              # Client API et anciens adapters
│   ├── query/                            # QueryClient et query keys
│   ├── public/                           # Tokens et animations publiques
│   └── server/                           # Gestion serveur des cookies
├── public/                               # Images, mascotte et polices
├── middleware.ts                         # Protection des routes /admin
└── tests/                                # Tests frontend
```

---

# PARTIE I — LANDING PAGE PUBLIQUE

## 3. Route et rendu

La landing page est définie dans :

```text
app/page.tsx
```

Elle correspond à la route :

```text
/
```

Le fichier ne contient pas la directive `"use client"`. La page est donc rendue comme **Server Component** par défaut. Elle n’appelle aucune API et ne dépend d’aucun état React local.

Conséquences :

- HTML initial généré côté serveur ;
- bonne base SEO ;
- faible quantité de JavaScript propre à la page ;
- contenu visible même avant hydratation ;
- absence de dépendance au backend YeYamo pour afficher la landing.

## 4. Layout racine

Le fichier `app/layout.tsx` enveloppe toutes les routes, publiques et administratives.

Il assure :

- la déclaration de la langue française via `<html lang="fr">` ;
- l’activation explicite de `data-scroll-behavior="smooth"` ;
- le chargement des styles `app/globals.css` ;
- le chargement local des polices ;
- les métadonnées SEO générales ;
- l’installation des providers React globaux.

### Polices

Deux familles locales sont chargées avec `next/font/local` :

```text
public/fonts/Heading-Regular.ttf
public/fonts/Heading-SemiBold.ttf
public/fonts/Inter-Regular.otf
public/fonts/Inter-SemiBold.otf
```

Variables CSS générées :

```css
--font-heading
--font-body
```

La police `Inter` sert au texte courant. La police heading est disponible pour les titres et éléments de marque.

## 5. Organisation interne de la landing

La landing est actuellement regroupée dans un fichier unique `app/page.tsx`. Elle utilise des tableaux typés pour séparer les données de présentation du JSX.

Types locaux :

- `NavItem` : entrée de navigation ;
- `FeatureItem` : fonctionnalité principale ;
- `StripItem` : élément de la bande rouge ;
- `InfoCard` : carte d’information secondaire ;
- `FaqItem` : question/réponse.

Composants locaux :

- `SectionIcon` : normalise le rendu d’une icône Lucide ;
- `FloatingCard` : carte flottante autour du mockup principal ;
- `Home` : composition complète de la page.

## 6. Sections de la landing

### 6.1 Navigation supérieure

Classe principale :

```css
.topbar
```

Contenu :

- logo YeYamo ;
- wordmark ;
- navigation par ancres ;
- bouton d’accès au dashboard.

Ancres disponibles :

- `#features` ;
- `#solutions` ;
- `#roles` ;
- `#security` ;
- `#about` ;
- `#documentation`.

Le bouton **Accéder au dashboard** utilise `next/link` et cible `/admin`. Le middleware redirige ensuite automatiquement vers `/admin/login` si aucune session n’existe.

### 6.2 Hero principal

Classe racine :

```css
.hero
```

Le hero est divisé en deux colonnes :

```text
.hero__copy    # message, CTA et bénéfices
.hero__visual  # appareils, captures et mascotte
```

Le contenu éditorial comprend :

- badge introductif ;
- titre principal en deux lignes ;
- texte de proposition de valeur ;
- CTA primaire vers `#features` ;
- CTA secondaire vers `#about` ;
- quatre mini-bénéfices.

Le visuel comprend :

- deux mockups mobiles ;
- une capture du dashboard dans un écran desktop ;
- la mascotte Yamo ;
- trois cartes flottantes ;
- un halo décoratif ;
- une vague SVG en plusieurs couches.

### 6.3 Bloc fonctionnalités

Identifiant :

```text
#features
```

Les fonctionnalités sont déclarées dans `featureItems` puis rendues avec `map`.

Fonctionnalités présentées :

- découverte personnalisée ;
- culture et patrimoine ;
- communauté locale ;
- expériences authentiques.

### 6.4 Bande solutions

Identifiant :

```text
#solutions
```

La bande rouge met en avant quatre verbes métier :

- Explorer ;
- Partager ;
- Découvrir ;
- Participer.

### 6.5 Cartes d’information

La section `info-grid` expose les thèmes :

- rôles ;
- sécurité ;
- à propos ;
- documentation.

Chaque carte possède un identifiant utilisé par la navigation par ancres.

### 6.6 FAQ

La FAQ utilise les éléments HTML natifs :

```html
<details>
<summary>
```

Cette solution évite un état React inutile et offre une base accessible au clavier.

### 6.7 Footer

Le footer contient :

- rappel de marque ;
- liens de navigation ;
- informations de contact ;
- accès au dashboard ;
- liens sécurité, à propos et documentation ;
- copyright.

Les coordonnées actuelles sont du contenu de présentation et doivent être vérifiées avant mise en production.

## 7. Assets publics

Assets utilisés directement par la landing :

```text
public/brand/yeyamo-logo.png
public/landing/app-dashboard.png
public/landing/app-mobile-explorer.png
public/landing/app-mobile-home.png
public/mascot/yamo.png
```

Asset présent mais non utilisé directement dans le JSX actuel :

```text
public/landing/hero-background.webp
```

Les images principales utilisent `next/image`, avec :

- dimensions explicites pour les logos et la mascotte ;
- `fill` pour les captures dans leurs conteneurs ;
- `sizes` pour aider Next.js à choisir la bonne taille ;
- `priority` sur les médias visibles immédiatement.

## 8. Design system public

Les variables globales sont définies au début de `app/globals.css`.

Principales couleurs :

```css
--primary: #e30613;
--primary-dark: #b9000d;
--primary-deep: #98000b;
--text: #101828;
--text-soft: #475467;
--surface: #ffffff;
```

Autres familles de tokens :

- surfaces ;
- bordures ;
- ombres ;
- rayons ;
- largeur maximum du conteneur.

Une représentation TypeScript existe également dans :

```text
lib/public/design-tokens.ts
```

Elle contient les couleurs, rayons, dimensions, mouvements et ombres. Dans l’implémentation actuelle, la landing consomme surtout les variables CSS ; les tokens TypeScript sont préparatoires.

## 9. Responsive de la landing

Les principaux breakpoints de `app/globals.css` sont :

```text
1280 px
1100 px
768 px
520 px
```

Comportements principaux :

- réduction progressive des espacements ;
- réorganisation du hero ;
- adaptation des mockups ;
- masquage ou déplacement de certains éléments flottants ;
- navigation adaptée aux petites largeurs ;
- grilles transformées en colonnes ;
- CTA rendus plus faciles à utiliser sur mobile.

## 10. Accessibilité publique

Éléments déjà présents :

- `lang="fr"` ;
- labels ARIA sur la navigation et les zones illustrées ;
- `aria-hidden="true"` pour les icônes décoratives ;
- textes alternatifs pour les images significatives ;
- FAQ basée sur des éléments HTML natifs ;
- liens d’ancrage explicites ;
- structure sémantique avec `header`, `main`, `section`, `article`, `nav` et `footer`.

## 11. Animations publiques

Le fichier `lib/public/animations.ts` définit plusieurs variants Framer Motion :

- révélation par direction ;
- apparition du badge ;
- stagger du titre ;
- mouvement du hero ;
- flottement des cartes ;
- mouvement du halo.

La landing actuelle n’importe pas ces variants. Ils constituent une base disponible pour une évolution animée, mais ne doivent pas être ajoutés partout sans tenir compte de `prefers-reduced-motion` et des performances.

---

# PARTIE II — DASHBOARD ADMINISTRATEUR

## 12. Routage du dashboard

Toutes les pages métier sont situées sous :

```text
app/(dashboard)/admin/
```

Le groupe `(dashboard)` n’apparaît pas dans l’URL. Exemples :

```text
app/(dashboard)/admin/page.tsx
→ /admin

app/(dashboard)/admin/users/page.tsx
→ /admin/users

app/(dashboard)/admin/users/[id]/page.tsx
→ /admin/users/:id
```

Le fichier `app/(dashboard)/admin/[...slug]/page.tsx` sert de fallback générique pour les modules décrits dans `admin-config.ts` qui ne possèdent pas encore de page spécialisée. Il charge `ModulePage` ou retourne `notFound()` si le module est inconnu.

## 13. Layout administratif

Le fichier :

```text
app/(dashboard)/admin/layout.tsx
```

applique :

- les métadonnées propres à l’administration ;
- la feuille `admin.css` ;
- le composant `AdminShell`.

Le shell produit cette structure :

```text
AdminShell
├── Sidebar
└── admin-shell
    ├── Topbar
    └── admin-main
        └── page métier
```

`AdminShell` est un Client Component, car il gère l’ouverture du menu latéral sur tablette et petit écran.

## 14. Sidebar

Le composant `components/sidebar.tsx` :

- lit la route courante avec `usePathname()` ;
- lit la session avec `useAdminSession()` ;
- filtre les modules avec la fonction `can()` ;
- applique l’état actif ;
- affiche badges, icônes et identité ;
- ferme le panneau après navigation sur petit écran.

La navigation ne doit donc pas être codée directement dans le JSX de la sidebar. Sa source est :

```text
lib/admin-config.ts
```

Chaque module définit notamment :

```ts
{
  label,
  href,
  roles,
  permissions,
  scopes,
  domain,
  icon,
  badge,
  summary,
  highlights,
  primaryAction,
  showInSidebar
}
```

Domaines de navigation :

- `core` : socle ;
- `operations` : opérations métier ;
- `growth` : croissance ;
- `governance` : gouvernance.

## 15. Topbar

Le composant `components/topbar.tsx` affiche :

- titre et sous-titre dérivés de la route ;
- bouton menu responsive ;
- recherche globale visuelle ;
- cloche de notifications ;
- sélection de période visuelle ;
- identité de session ;
- menu profil, sécurité et déconnexion.

La déconnexion appelle :

```text
POST /api/auth/logout
```

puis redirige vers `/admin/login`.

La recherche globale et le bouton période ne sont pas encore branchés sur un moteur global dans ce composant.

## 16. Page d’accueil du dashboard

La route `/admin` rend :

```text
components/admin-live-dashboard.tsx
```

Flux :

```text
AdminLiveDashboard
→ useQuery
→ adminApi.analytics.dashboard
→ apiFetch
→ proxy Next.js
→ API Gateway
→ analytics-service
```

Endpoint utilisé :

```text
GET /api/v1/analytics/admin/dashboard
```

La page affiche :

- un skeleton pendant le chargement ;
- un état d’erreur avec bouton de nouvelle tentative ;
- des cartes KPI générées depuis la réponse backend ;
- une indication de la source de données.

## 17. Architecture feature-based

Les modules métier spécialisés sont regroupés dans `features/`.

Structure cible réellement utilisée :

```text
features/<domaine>/
├── api/          # appels HTTP du domaine
├── components/   # pages et composants métier
├── schemas/      # validation Zod
└── types/        # DTO TypeScript et enums
```

Exemples :

```text
features/users/
features/administrators/
features/partners/
features/geography/
features/catalog/
features/events/
features/reservations/
features/finance/
features/moderation/
features/gamification/
features/campaigns/
features/analytics/
features/support/
features/newsletter/
features/search-discovery/
features/settings/
features/notifications/
```

## 18. Construction typique d’une page admin

Une route App Router reste volontairement fine.

Exemple conceptuel :

```tsx
import { PlatformUsersPage } from "@/features/users/components/platform-users-page";

export default function Page() {
  return <PlatformUsersPage />;
}
```

Le composant métier orchestre ensuite :

1. l’état des filtres dans l’URL ;
2. la query TanStack Query ;
3. les mutations ;
4. les permissions d’interface ;
5. les composants UI communs ;
6. l’invalidation du cache ;
7. les toasts ;
8. les confirmations sensibles.

## 19. Exemple détaillé : utilisateurs plateforme

Le module utilisateurs illustre la convention complète.

Fichiers :

```text
features/users/api/platform-users-api.ts
features/users/components/platform-users-page.tsx
features/users/components/platform-user-detail.tsx
features/users/types/platform-user.ts
```

La page liste :

- prépare les filtres ;
- effectue un debounce de 350 ms sur la recherche ;
- appelle `platformUsersApi.list()` ;
- affiche les lignes dans `AdminDataTable` ;
- protège les actions avec `Can` ;
- ouvre une confirmation avant suspension ;
- exécute une mutation ;
- affiche un toast ;
- invalide `queryKeys.users.all`.

Ce modèle doit être réutilisé pour les autres listes administratives.

## 20. Composants UI transverses

### `AdminPageHeader`

Titre, description, breadcrumb et actions principales.

### `AdminDataTable`

Supporte :

- colonnes typées ;
- loading ;
- error ;
- empty state ;
- pagination serveur ;
- sélection multiple ;
- actions par ligne ;
- tri déclenché par colonne ;
- scrolling horizontal ;
- header fixe ;
- colonne d’actions fixe ;
- caption accessible.

### `AdminFilters`

Conteneur cohérent pour recherche, selects, dates, tri et réinitialisation.

### `AdminDialog`

Gère :

- rôle `dialog` ;
- `aria-modal` ;
- focus initial ;
- boucle de focus ;
- fermeture avec `Escape` ;
- restauration du focus ;
- blocage du scroll ;
- fermeture via backdrop.

### `AdminConfirmDialog`

Utilisé avant les mutations sensibles ou destructives.

### Autres composants

- `AdminSearchInput` ;
- `AdminPagination` ;
- `AdminSort` ;
- `AdminStatusBadge` ;
- `AdminEmptyState` ;
- `AdminErrorState` ;
- `AdminSkeleton` ;
- `AdminTabs` ;
- `AdminTimeline` ;
- `AdminStatCard` ;
- `AdminDateRangePicker` ;
- `AdminPermissionGuard` ;
- système de toast global.

## 21. État dans l’URL

Le hook `useAdminUrlState()` centralise :

```text
page
size
search
status
role
region
city
category
sort
from
to
```

Avantages :

- conservation des filtres après refresh ;
- liens partageables ;
- retour navigateur cohérent ;
- pagination reproductible ;
- absence de store global inutile pour les filtres.

## 22. TanStack Query

Le `QueryClient` est créé une seule fois dans `app/providers.tsx`.

Configuration principale :

- `staleTime` : 30 secondes ;
- `gcTime` : 5 minutes ;
- pas de refetch automatique au focus ;
- maximum deux tentatives sur erreurs éligibles ;
- aucune répétition automatique pour 401, 403 et 404 ;
- aucune répétition automatique des mutations ;
- propagation centralisée des erreurs vers le système de toast.

Les clés sont centralisées dans :

```text
lib/query/query-keys.ts
```

Chaque domaine expose :

```text
all
lists()
list(params)
details()
detail(id)
```

## 23. Authentification administrateur

### Route de connexion

```text
/admin/login
```

Le formulaire appelle :

```text
POST /api/auth/login
```

La route Next.js transmet les identifiants à :

```text
POST {API_BASE_URL}/api/v1/auth/login
```

Après succès, elle vérifie que l’utilisateur possède un rôle privilégié.

Rôles reconnus :

- `SUPER_ADMIN` ;
- `ADMIN` ;
- `MODERATOR` ;
- `EDITOR` ;
- `SUPPORT` ;
- `COMMERCIAL`.

### Cookies

Cookies HttpOnly utilisés :

```text
yeyamo_admin_access
yeyamo_admin_refresh
yeyamo_admin_user
```

Le JWT n’est pas exposé au JavaScript navigateur.

### Middleware

`middleware.ts` protège toutes les routes `/admin/:path*`, sauf `/admin/login`.

Sans access token ni refresh token, il redirige vers :

```text
/admin/login?next=<route demandée>
```

### Session frontend

`SessionProvider` appelle :

```text
GET /api/auth/session
```

et fournit :

```ts
AdminSession {
  id;
  firstName?;
  lastName?;
  email;
  avatar?;
  roles[];
  permissions[];
  scopes[];
}
```

## 24. RBAC frontend

Le système RBAC est centralisé dans :

```text
features/auth/permissions.tsx
```

API disponible :

- `can(session, requirement)` ;
- `useCan(requirement)` ;
- `usePermissions()` ;
- `<Can>` ;
- `<AdminPermissionGuard>`.

Un requirement peut contenir :

```ts
{
  roles?: string[];
  permissions?: string[];
  scopes?: string[];
}
```

Le frontend masque les actions non autorisées, mais le backend reste toujours l’autorité finale.

## 25. Client API

Le client principal est :

```text
lib/api/client.ts
```

Fonction centrale :

```ts
apiFetch<T>(path, init, retried)
```

Flux d’une requête :

```text
Feature API
→ apiFetch
→ /api/backend/api/v1/...
→ proxy Next.js
→ API Gateway :8083
→ microservice propriétaire
```

### Refresh automatique

Lors d’un 401 :

1. appel de `POST /api/auth/refresh` ;
2. une seule promesse de refresh partagée entre requêtes concurrentes ;
3. renouvellement des cookies ;
4. répétition unique de la requête initiale ;
5. redirection login si le refresh échoue.

### Erreur typée

```ts
ApiError {
  status;
  code;
  message;
  correlationId?;
  details?;
}
```

Le frontend ne transforme pas une erreur backend en donnée fictive.

## 26. Proxy backend Next.js

Le proxy se trouve dans :

```text
app/api/backend/[...path]/route.ts
```

Responsabilités :

- récupérer le JWT depuis le cookie HttpOnly ;
- refuser une requête sans session ;
- limiter les routes à une allowlist ;
- injecter `Authorization: Bearer ...` ;
- conserver les query parameters ;
- transmettre `Content-Type` ;
- transmettre `Idempotency-Key` ;
- streamer le body de la réponse backend ;
- préserver le statut HTTP.

Méthodes exposées :

- GET ;
- POST ;
- PUT ;
- PATCH ;
- DELETE.

## 27. Formulaires

Les formulaires métier utilisent progressivement :

- schémas Zod dans `features/<domaine>/schemas/` ;
- types dédiés ;
- hook commun dans `lib/forms/use-zod-form.ts` ;
- erreurs par champ ;
- erreurs backend ;
- état pending ;
- confirmation pour les actions sensibles.

Les nouveaux formulaires ne doivent pas utiliser `window.prompt()`.

## 28. Styles du dashboard

La feuille principale est :

```text
app/(dashboard)/admin/admin.css
```

Tokens admin définis sur `.admin-app` :

```css
--admin-primary
--admin-primary-strong
--admin-text
--admin-muted
--admin-border
--admin-surface
--admin-focus
--admin-success
--admin-warning
--admin-danger
--admin-radius-sm
--admin-radius-md
--admin-radius-lg
--admin-shadow
```

La console privilégie :

- densité professionnelle ;
- cartes compactes ;
- tables lisibles ;
- rayons modérés ;
- actions explicites ;
- rouge YeYamo comme accent ;
- gris neutres pour les données secondaires.

## 29. Responsive du dashboard

Breakpoints principaux :

```text
1280 px
1024 px
768 px
```

À partir de 1024 px :

- sidebar transformée en drawer ;
- scrim activé ;
- bouton menu affiché ;
- recherche topbar masquée ;
- contenu sans marge latérale fixe.

À partir de 768 px :

- topbar simplifiée ;
- filtres empilés ;
- boutons d’action élargis ;
- pagination réorganisée ;
- dialogs transformés en panneau bas ;
- tabs scrollables horizontalement.

Le dashboard reste desktop-first, mais demeure utilisable sur tablette.

## 30. Accessibilité admin

Le socle couvre notamment :

- focus visible uniforme ;
- labels invisibles accessibles ;
- navigation clavier des tabs ;
- focus trap dans les dialogs ;
- restauration du focus ;
- `aria-busy` ;
- `aria-live` ;
- rôles `alert`, `status`, `dialog`, `tablist` et `region` ;
- captions de tables ;
- support de `prefers-reduced-motion`.

## 31. Ajouter une nouvelle page admin correctement

Ordre recommandé :

1. créer les DTO dans `features/<domaine>/types/` ;
2. créer les schémas Zod dans `schemas/` ;
3. créer l’adapter API dans `api/` ;
4. ajouter les query keys si le domaine n’existe pas ;
5. créer le composant métier dans `components/` ;
6. créer une page App Router fine ;
7. ajouter la navigation dans `lib/admin-config.ts` ;
8. déclarer rôles, permissions et scopes ;
9. utiliser les composants UI communs ;
10. conserver filtres et pagination dans l’URL ;
11. invalider les bonnes queries après mutation ;
12. ajouter loading, empty et error states ;
13. ajouter les tests ;
14. valider lint, TypeScript et build.

## 32. Ce qu’il ne faut pas faire

- ne pas appeler directement l’API Gateway depuis un Client Component ;
- ne pas lire le JWT dans le navigateur ;
- ne pas stocker les tokens dans `localStorage` ;
- ne pas créer une deuxième instance de client HTTP ;
- ne pas dupliquer le shell, la sidebar ou la topbar ;
- ne pas coder les permissions uniquement dans le JSX ;
- ne pas inventer de données quand une API manque ;
- ne pas calculer des agrégats globaux depuis une page paginée ;
- ne pas effectuer d’optimistic update sur une opération financière sensible ;
- ne pas envoyer `actorId` depuis l’interface quand il doit venir du JWT ;
- ne pas introduire un nouveau style propre à un module sans réutiliser le design system.

---

# PARTIE III — RELATION ENTRE LANDING ET ADMIN

## 33. Points communs

Les deux univers partagent :

- le layout racine ;
- les polices locales ;
- `AppProviders` ;
- l’identité visuelle rouge YeYamo ;
- les assets de marque ;
- Next.js App Router.

## 34. Séparation visuelle et fonctionnelle

La landing utilise principalement :

```text
app/globals.css
```

Le dashboard utilise en plus :

```text
app/(dashboard)/admin/admin.css
```

La landing est éditoriale, publique et statique. Le dashboard est transactionnel, authentifié et alimenté par les microservices.

## 35. Passage landing vers dashboard

Flux :

```text
Landing /
→ bouton Accéder au dashboard
→ /admin
→ middleware
→ session présente : dashboard
→ session absente : /admin/login?next=/admin
→ login
→ cookies HttpOnly
→ retour /admin
```

---

# PARTIE IV — ÉTAT ACTUEL ET POINTS D’ATTENTION

## 36. Forces actuelles

- séparation claire landing/admin ;
- landing rendue côté serveur ;
- assets optimisés via `next/image` ;
- navigation admin pilotée par configuration ;
- RBAC visible dans l’interface ;
- JWT conservé en cookie HttpOnly ;
- refresh automatique mutualisé ;
- proxy backend avec allowlist ;
- architecture feature-based ;
- composants UI communs ;
- pagination et filtres URL ;
- états loading/error/empty ;
- gestion du `correlationId` ;
- confirmations pour actions sensibles ;
- base responsive et accessible.

## 37. Dette technique observée

### Encodage

Plusieurs chaînes françaises apparaissent encodées incorrectement dans les sources (`Ã©`, `â€™`, etc.). Une normalisation UTF-8 globale doit être réalisée avec prudence, sans modifier les contrats ou valeurs métier.

### Landing monolithique

`app/page.tsx` contient toutes les sections. Le fichier reste compréhensible, mais une évolution importante pourrait justifier :

```text
components/landing/landing-header.tsx
components/landing/hero.tsx
components/landing/features.tsx
components/landing/faq.tsx
components/landing/footer.tsx
```

Cette extraction doit rester purement structurelle.

### Providers globaux

`SessionProvider` enveloppe actuellement toute l’application, y compris la landing. Il peut donc appeler `/api/auth/session` sur une page publique. Une optimisation future consisterait à limiter le provider de session à l’espace admin, tout en gardant Query et Toast au niveau approprié.

### Tokens publics en double

Les tokens existent dans `globals.css` et `lib/public/design-tokens.ts`. Il faut choisir une source d’autorité ou documenter précisément leurs usages pour éviter une divergence.

### Animations préparées mais non utilisées

`lib/public/animations.ts` est actuellement une bibliothèque préparatoire. Elle ne doit pas être considérée comme active tant qu’aucun composant ne l’importe.

### Ancien client générique

`lib/api/admin-api.ts` utilise encore `ApiRecord` sur plusieurs anciens flux. Les modules métier modernes utilisent des API et DTO dédiés. Toute nouvelle page doit suivre les modules typés, pas étendre l’usage d’`ApiRecord`.

### Recherche et période de topbar

Ces contrôles sont visuellement présents mais ne pilotent pas encore un état global partagé.

## 38. Commandes de validation

Depuis `yeyamo-admin` :

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Lancement local :

```powershell
npm run dev
```

Routes principales :

```text
http://localhost:3000/
http://localhost:3000/admin/login
http://localhost:3000/admin
```

## 39. Résumé architectural

```text
PUBLIC
Browser
  → Next.js Server Component
  → app/page.tsx
  → globals.css + public assets

ADMIN
Browser
  → middleware auth
  → AdminLayout
  → AdminShell
  → Feature Component
  → TanStack Query
  → Typed Feature API
  → apiFetch
  → Next.js backend proxy
  → API Gateway
  → Microservice YeYamo
```

La landing présente la vision YeYamo. Le dashboard applique cette vision sous forme d’une console métier sécurisée, modulaire et connectée aux microservices.
