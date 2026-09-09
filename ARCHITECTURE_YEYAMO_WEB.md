# ARCHITECTURE TECHNIQUE ET FONCTIONNELLE CIBLE — YEYAMO WEB

> Date : 9 septembre 2026  
> Statut : conception, aucune route ni API créée  
> Source obligatoire : `AUDIT_ALIGNEMENT_MOBILE_WEB.md`  
> Convention : tout élément préfixé **CIBLE — NON ENCORE IMPLÉMENTÉ** est une proposition. Les éléments sans ce préfixe sont observés dans le repository.

## 1. Résumé exécutif

Yeyamo Web doit rester dans l’application Next.js actuelle et évoluer par ajout de route groups isolés. `/` devient le Feed public; la landing devient `/about`; `/admin/**` reste un produit interne inchangé. L’architecture recommandée sépare quatre frontières : lecture publique, session User, espace Partner utilisant la session User avec autorisation métier, et Admin existant.

Le modèle recommandé est un BFF Next.js à deux façades : **CIBLE — NON ENCORE IMPLÉMENTÉ** `/api/public/**` pour les GET anonymes allowlistés et `/api/user/**` pour auth, session et mutations User/Partner. Le proxy Admin `/api/backend/**` ne change pas. L’inspection du Gateway confirme que lieux, événements, culture, œuvres, artisans et certains profils sont publics, mais `/feed`, `/stories` et `/discovery/**` sont actuellement authentifiés : leur ouverture backend est un blocker P0 avant le Feed public.

## 2. Décisions issues de l’audit précédent

- Feed à `/`; aucun `/feed` canonique.
- Landing à `/about` sans onboarding Web.
- Consultation publique; authentification uniquement sur action.
- Post et commentaires fusionnés sur Desktop.
- Wizards Mobile fusionnés en formulaires Web sectionnés.
- Partner séparé visuellement de l’Admin, mais adossé à la session User.
- Aucun mock de production pour compenser un backend absent.
- Contrats métier réutilisés; composants React Native non portés.

## 3. État technique Web revalidé

| Élément | État actuel | Impact futur Web |
|---|---|---|
| `/` | `app/page.tsx` rend `LandingPage` | devra devenir Feed |
| Root layout | polices locales + `AppProviders` | metadata et providers à segmenter |
| Providers | QueryClient + Toast Admin + Session Admin globaux | sortir les providers Admin du scope public progressivement |
| Middleware | matcher `/admin/:path*` uniquement | préserver exactement ce périmètre |
| Admin auth | `/api/auth/**`, contrôle rôles privilégiés | ne pas réutiliser pour User |
| Cookies Admin | `yeyamo_admin_access`, `refresh`, `user` | noms et comportement inchangés |
| Proxy Admin | `/api/backend/**`, token requis, allowlist | ne pas élargir |
| Admin CSS | `app/(dashboard)/admin/admin.css` + globals | maintenir l’isolation; réduire globals landing à terme |
| Query | TanStack Query 5, client global | créer clés et erreurs par domaine sans casser Admin |
| Map | `mapbox-gl` installé | base suffisante pour Map Web |
| Fonts/tokens | fonts locales, `lib/public/design-tokens.ts` | réutilisables comme base, à normaliser Prompt 3 |
| Next | 15.4, App Router, `typedRoutes: true`, standalone | routes cibles compatibles; attention liens typés |
| TypeScript | strict, bundler resolution, alias `@/*` | conserver |
| Tailwind | v4 via PostCSS | breakpoints à formaliser sans package additionnel |
| Environnement | API URL, app URL, token Mapbox | séparer variables serveur/public; ne jamais exposer secrets |

Preuves : `app/layout.tsx`, `app/providers.tsx`, `middleware.ts`, `lib/server/backend.ts`, `app/api/backend/[...path]/route.ts`, `next.config.ts`, `package.json`, `tsconfig.json`.

## 4. Architecture globale cible

```text
Browser
├── pages publiques SSR/RSC ──> BFF Public ──> Yeyamo Gateway
├── interactions User ────────> BFF User ────> Yeyamo Gateway
├── workspace Partner ────────> BFF User + contrôle backend Partner
└── Admin existant ───────────> Proxy Admin existant ─> Gateway
```

Le root layout reste minimal : document, fonts et styles réellement globaux. Chaque produit possède ensuite son layout, ses providers de session, sa navigation, ses erreurs et ses styles.

## 5. Route groups

| Group cible | Responsabilité | Layout/provider | Session | Navigation/styles |
|---|---|---|---|---|
| `(public)` | feed et contenu indexable | RSC layout + provider public léger | optionnelle | shell public, styles produit |
| `(auth-user)` | login/register/recovery | layout centré, Turnstile/OAuth clients | aucune au départ | sans shell principal |
| `(user)` | données privées | garde serveur + UserSessionProvider | User requise | shell public authentifié |
| `(partner)` | outils partenaire | garde serveur User + statut Partner | User + autorisation backend | PartnerShell isolé |
| `(marketing)` | about/help/privacy | RSC éditorial | aucune | MarketingShell léger |
| `(dashboard)` | Admin existant | layout existant | Admin | inchangé |

Les groups n’affectent pas les URLs. `(auth)` existe déjà autour de `/admin/login`; pour éviter une ambiguïté de maintenance, le nouveau group s’appelle `(auth-user)`.

## 6. Arborescence des routes

Toutes les routes ci-dessous, sauf `/admin/**`, sont **ROUTES CIBLES — NON ENCORE IMPLÉMENTÉES**.

```text
app/
├── layout.tsx
├── (public)/
│   ├── layout.tsx
│   ├── page.tsx                         / Feed
│   ├── posts/[id]/page.tsx              /posts/[id]
│   ├── stories/[id]/page.tsx            /stories/[id]
│   ├── explore/page.tsx                 /explore
│   ├── search/page.tsx                  /search
│   ├── map/page.tsx                     /map
│   ├── places/{page,[id]/page,directions/page}
│   ├── events/{page,[id]/page}
│   ├── experiences/{page,[id]/page}
│   ├── activities/[id]/page.tsx
│   ├── culture/{page,[id],traditions,transmission,proverbs,recipes}/**
│   ├── languages/{page,[code],lessons/[id]}/**
│   ├── challenges/{page,[id]/page}
│   ├── artisans/{page,[id]/page}
│   ├── artworks/{page,[id]/page}
│   └── @/[username]/page.tsx
├── (auth-user)/{login,register,forgot-password,reset-password,verify-email}/page.tsx
├── (user)/
│   ├── messages/{page,[id]/page}
│   ├── profile/page.tsx
│   ├── settings/{page,profile,security,social,interests}/page.tsx
│   ├── favorites/page.tsx
│   ├── collections/{page,[id]/page}
│   ├── reservations/page.tsx
│   ├── tickets/{page,[id]/page}
│   ├── orders/artworks/{page,[id]/page}
│   ├── passport/page.tsx
│   ├── badges/{page,[id]/page}
│   └── create/{post,story,event,artwork,culture-contribution}/page.tsx
├── (partner)/partner/**
├── (marketing)/{about,help,privacy}/page.tsx
├── (auth)/admin/login/page.tsx          EXISTANT
└── (dashboard)/admin/**                 EXISTANT
```

## 7. Layouts et shells

- RootLayout : Server Component; fonts, `<html>`, metadata defaults neutres; aucun appel session.
- PublicWebLayout : Server Component; lit éventuellement un résumé de session sans bloquer le rendu; monte PublicShell et un petit client provider d’interaction.
- AuthUserLayout : Server Component; redirige un utilisateur déjà connecté uniquement si cela respecte `next`.
- UserLayout : Server Component garde; transmet une session sérialisable minimale à UserSessionProvider.
- PartnerLayout : Server Component garde User puis statut Partner; monte PartnerShell.
- MarketingLayout : Server Component éditorial, sans QueryClient obligatoire.
- AdminLayout : existant, inchangé.

## 8. Architecture responsive

Breakpoints fonctionnels : Mobile `<768`, Tablet `768–1199`, Desktop `>=1200`. Ils correspondent à la demande produit; Tailwind peut exposer `md` à 768 et un breakpoint fonctionnel `xl` à 1200 lors du Prompt 3.

- Mobile : header compact, contenu plein écran, bottom navigation cinq entrées.
- Tablet : rail compact dès que 768 px utiles sont disponibles; contenu 1–2 colonnes; bottom nav disparaît.
- Desktop : sidebar 240–280 px, contenu variable, panneau contextuel 300–360 px si utile.
- Ultra-large : largeur utile plafonnée entre 1440 et 1680 px; espaces latéraux grandissent, pas les médias sans limite.
- Zoom : aucun shell à hauteur rigide; navigation et panneaux doivent rester accessibles à 200 %.

## 9. Public Web Shell

Sidebar Desktop sticky sous le viewport, avec logo, Feed, Explorer, Create, Messages, Notifications et Profile/Login selon session. Main scroll document par défaut; seuls Chat et Map peuvent utiliser un workspace scrollé localement. Le right panel est facultatif et réservé aux suggestions, tendances, commentaires ou CTA. Sur mobile, bottom nav respecte safe areas; Create ouvre une modal/drawer et n’est pas une destination principale.

## 10. Feed `/`

Le Feed combine une première réponse SSR/RSC quand l’API devient publique et une Infinite Query client pour la suite. Média cible : colonne centrale de 560–720 px; hauteur maximale liée au viewport; `object-fit: contain` pour préserver le ratio. Le rail d’actions reste adjacent au média. À 1366 px, pas de panneau droit obligatoire; à 1440 px il est conditionnel; à 1920/2560 px il apparaît sans élargir excessivement le média.

Une seule vidéo joue à la fois. IntersectionObserver sélectionne l’item actif; pause hors viewport/onglet; autoplay muted; contrôle explicite du son; poster et fallback. Le contenu sponsorisé garde le même pipeline de rendu avec étiquette, tracking impression/clic et aucune imitation de contenu organique.

## 11. Post Detail

**ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE** `/posts/[id]` est canonique et chargeable directement. Desktop : média/publication à gauche, commentaires à droite. Mobile : commentaires en sheet accessible ou page interne sans changer la canonical. Depuis le Feed Desktop, une interception de route/overlay est possible, mais fermeture revient au Feed; un chargement direct rend toujours une page complète. Metadata, OpenGraph et URL de partage sont calculés côté serveur.

## 12. Explore/Search/Map

`/explore` agrège catégories et tendances; `/search` présente résultats typés; `/places`, `/events`, `/experiences` restent des listes dédiées; `/map` est un workspace carte/liste. Les filtres stables sont reflétés dans `searchParams`; les noms d’URL sont un état Web et ne prétendent pas être des paramètres backend. Un mapper par feature traduit URL → filtre métier → paramètres réellement supportés. La pagination serveur utilise pages/cursors observés; l’infinite scroll ne doit pas rendre les URLs non partageables.

## 13. Pages de détail

Pattern commun : breadcrumb/retour, galerie, identité, description, données structurées, sections métier, avis, contenus liés, CTA contextuel sticky. Place → réserver/itinéraire; Event → s’inscrire/billet; Experience/Activity → réserver; Artisan → suivre/contacter; Artwork → sauvegarder/commander; Challenge → rejoindre; Culture → sauvegarder/contribuer. Mobile empile; Desktop utilise 2 colonnes; ReadingLayout limite le texte à 70–80 caractères.

## 14. Auth User

**CIBLE — NON ENCORE IMPLÉMENTÉ** : Browser → routes Next User → `/api/v1/auth/**`. Cookies proposés : `yeyamo_user_access`, `yeyamo_user_refresh`, éventuellement `yeyamo_user_session`; HttpOnly, Secure en production, Path `/`, durées alignées sur le backend. `refresh` reste SameSite strict si compatible OAuth; access/session lax. Login, register, logout, refresh, session et OAuth sont distincts des routes Admin. Le BFF vérifie `/auth/me` ou le payload signé; il ne fait jamais confiance à un rôle envoyé par le client.

## 15. BFF Public/User

| Option | Avantage | Risque/coût | Décision |
|---|---|---|---|
| A `/api/user/**` seul | simple | mélange anonyme/auth | rejetée |
| B `/api/public/**` + `/api/user/**` | frontières explicites, allowlists séparées | deux clients | retenue |
| C RSC/Actions seulement | peu de routes | insuffisant pour map/feed/chat/uploads | complément, pas fondation |

**CIBLE — NON ENCORE IMPLÉMENTÉ** : `/api/public/**` n’accepte que GET/HEAD vers une allowlist publique; aucune élévation par cookie. `/api/user/**` utilise les cookies User pour auth et mutations. Partner passe par `/api/user/**` et le backend valide rôle, propriété et permissions. Admin conserve `/api/backend/**`.

## 16. GET publics à confirmer

| Famille | Doit être publique Web | Preuve backend | Statut |
|---|:---:|---|---|
| `/api/v1/places|regions|cities|districts|categories/**` | oui | Gateway `isPublicMobileRequest`; place-service GET permitAll | CONFIRMÉ PUBLIC |
| `/api/v1/events/**` sauf `/events/me` | oui | Gateway allowlist explicite | CONFIRMÉ PUBLIC |
| `/api/v1/culture/**` | oui, sauf progression/mutations | Gateway GET allowlist; service affine leçons | CONFIRMÉ PUBLIC pour GET catalogue; sous-routes à tester |
| `/api/v1/culture-graph/**` | oui | Gateway + graph-service permitAll GET | CONFIRMÉ PUBLIC |
| `/api/v1/artworks/**` | oui | Gateway + catalog-service GET permitAll | CONFIRMÉ PUBLIC |
| `/api/v1/artisans/**`, specialties | oui | Gateway + partner-service GET permitAll | CONFIRMÉ PUBLIC |
| `/api/v1/users/{uuid}` | profil public | Gateway regex | CONFIRMÉ PUBLIC pour UUID |
| `/api/v1/partners/{uuid}` | profil public | Gateway regex | CONFIRMÉ PUBLIC pour UUID |
| `/api/v1/posts/{uuid}` | oui | Gateway + content-service regex | CONFIRMÉ PUBLIC |
| `/api/v1/feed` | oui | absent de l’allowlist Gateway | AUTH ACTUELLEMENT REQUISE |
| `/api/v1/stories/**` | oui | absent Gateway; service protège hors exceptions posts | AUTH ACTUELLEMENT REQUISE |
| `/api/v1/discovery/**` | oui | absent de l’allowlist Gateway | AUTH ACTUELLEMENT REQUISE |
| `/api/v1/recommendations` | souhaitable | absent allowlist | AUTH ACTUELLEMENT REQUISE |
| `/api/v1/tickets/events/{id}/types` | oui | contrôleur public observé, Gateway non confirmé | À VÉRIFIER |

## 17. Auth-on-action

`ProtectedAction` est un orchestrateur client, pas une autorisation. Sans session, il sérialise une intention minimale, ouvre `/login?next=...`, puis restaure seulement après succès. Trois niveaux : simple (`like`, `follow`, `favorite`); stateful (`commentDraft`, choix booking, quantité tickets, collection); formulaire (`create`, partner). Une intention destructive ou financière n’est jamais rejouée automatiquement : l’utilisateur confirme après retour.

## 18. Sécurité `next`

`next` accepte uniquement un chemin relatif commençant par `/`, jamais `//`, schéma, hôte, backslash ni caractères de contrôle. Il est normalisé via URL avec origine interne, comparé à une allowlist de familles et retombe sur `/`. L’intention est stockée côté session avec expiration courte et identifiant aléatoire; aucun payload sensible ou fichier dans l’URL/localStorage.

## 19. Sessions User/Partner/Admin

| Contexte | Session | Provider | Autorité | Collision évitée par |
|---|---|---|---|---|
| Public | optionnelle | PublicSessionSummary cible | aucune mutation | absence de garde |
| User | cookies User cibles | UserSessionProvider cible | backend | namespace User |
| Partner | même session User | PartnerContext cible | backend Partner/RBAC | pas de cookie Partner séparé |
| Admin | cookies/provider existants | SessionProvider existant | rôles privilégiés | namespace Admin inchangé |

## 20. Partner Web

PartnerShell possède sa sidebar métier, pas `AdminShell`. Desktop : dashboard, places, events, reservations, reviews, campaigns, promotions, finance, artworks/orders, settings. Tablet : rail; mobile : menu/drawer et pages linéaires. L’accès exige session User puis statut Partner retourné par le backend; KYC/statut peuvent produire un état bloqué explicite. Chaque ressource reste contrôlée côté backend contre le partnerId; jamais de confiance dans un partnerId de l’URL.

## 21. Architecture composants

Trois couches : `components/ui` primitives accessibles; `components/shells` navigation/layout; `features/*/components` métier. Les Server Components composent les pages et données initiales; les îlots clients portent vidéo, map, forms, mutations et realtime. Aucun `components/` monolithique ni import de `components/admin/**` depuis public/partner.

## 22. Design System

Le Prompt 3 doit consolider `lib/public/design-tokens.ts`, variables de `globals.css`, polices et états interactifs. Le système couvre couleur, typographie, espacement, rayon, ombre, z-index, mouvement, largeur de contenu, touch targets et densité Partner. Les tokens Admin ne sont pas renommés dans cette phase; une couche sémantique publique évite la contamination.

## 23. Contrats API

Option recommandée : génération depuis OpenAPI du Gateway en package/module de types communs au Web, puis mappers par feature. À défaut, extraire progressivement les DTO réellement partagés dans un package versionné. Ne pas importer du code React Native. Chaque endpoint possède méthode, path, request, response, auth, pagination, filtres et erreur. Aucun type Admin ne devient automatiquement type Public.

## 24. Data Layer/TanStack Query

Clés hiérarchiques par scope : `public/feed`, `public/places`, `user/session`, `user/collections`, `partner/events`; conserver les clés Admin existantes. SSR précharge les pages SEO et hydrate seulement les queries utiles. Infinite Query pour feed/messages/listes longues. Optimistic update permis pour like/favorite/read; rollback obligatoire. Interdit pour booking, paiement, ticket order et finance. Retry : GET réseau limité; aucun retry automatique des mutations non idempotentes. Correlation ID propagé dans `ApiError`.

## 25. Server vs Client Components

| Page/type | Server | Client |
|---|---|---|
| détails SEO | fetch initial, metadata, JSON-LD | galerie/actions |
| listes publiques | première page | filtres/infinite scroll |
| Feed | premier lot si public | viewport vidéo/interactions |
| Map | shell/metadata | Mapbox complet |
| Auth/forms | page/layout | validation et soumission |
| User/Partner | garde et données initiales | mutations/tables interactives |
| Chat | garde/session | socket, thread, composer |
| Marketing | contenu | animations isolées |

## 26. SSR/SEO

Metadata globale devient neutre. Chaque page publique fournit title, description, canonical et OpenGraph; Twitter card si média. JSON-LD : Place/LocalBusiness, Event, Article pour culture, Product/CreativeWork pour artwork selon données réellement disponibles. Sitemap segmente contenus; robots autorise public et exclut `/messages`, `/profile`, `/settings`, `/partner`, `/admin`, API et previews. Les pages privées sont `noindex,nofollow` et jamais mises en cache partagé.

## 27. Médias

Next/Image pour images compatibles; domaines distants allowlistés explicitement dans `next.config.ts` au moment de l’implémentation. Vidéo HTML5 avec poster, sources responsives si backend/CDN les fournit, preload `metadata` ou `none`, lazy mount, pause hors viewport et reduced motion. Le premier média LCP peut être prioritaire; les suivants non. CDN/cache immuable pour médias versionnés; uploads restent privés jusqu’à publication.

## 28. Map

Un composant client unique encapsule Mapbox, markers, clustering, popups, viewport et événements. Les données restent dans la feature places/discovery; la map ne fetch pas arbitrairement. `/map` synchronise bounds/filtres sélectionnés avec URL lorsque pertinent; Desktop split map/list, mobile bascule plein écran/list. Géolocalisation sur action utilisateur; directions via endpoint observé, sans exposer de secret Mapbox serveur.

## 29. Chat

Desktop : 280–340 px conversations, thread flexible, 300 px info optionnelle. Mobile : routes liste → conversation; info en page/drawer. Le client Reverb cible doit adapter `src/services/socket/reverb.client.ts` sans copier SecureStore. Reconnexion avec backoff/jitter, resynchronisation HTTP après reconnect, unread via Query cache, optimistic send avec identifiant temporaire et statut failed/retry. Pagination inverse des messages, accusés de lecture dédupliqués, uploads via abstraction commune. Auth socket obtenue via BFF User, jamais token JWT exposé durablement.

## 30. Upload

Une feature `media` commune expose sélection, validation MIME/extension/signature serveur, limites configurées, preview URL révoquée, compression image raisonnable, progression, annulation et retry. File input + drag/drop; capture caméra optionnelle. Les documents Partner ont règles et stockage distincts des médias publics. Aucun HTML/SVG actif non assaini; noms de fichiers non fiables; scan antivirus/backend requis selon politique.

## 31. Transactionnel

Le backend est l’autorité pour disponibilité, prix, devise, hold et statut. Chaque création booking/order/payment utilise l’idempotency déjà observée lorsque le contrat le prévoit. Désactiver double submit; persister uniquement un identifiant de transaction non sensible; recharger le statut après refresh. Les retours provider aboutissent à une page de résultat qui vérifie le backend, jamais les query params seuls. États : pending, success, failed, canceled, expired; reprise contrôlée, pas de retry aveugle.

## 32. Error Handling

Convention commune `{status, code, message, correlationId, details}` alignée sur `lib/api/client.ts`. Public : fallback/404/retry. User : un refresh mutualisé sur 401, puis login; 403 explicite; 409 conflit; 422 erreurs champs; 429 délai; 5xx incident. Partner : distinguer rôle, propriété, KYC et statut. Admin conserve son client actuel. Les messages utilisateurs n’exposent ni stack ni réponse sensible.

## 33. Loading/Empty/Error

Primitives : `Skeleton`, `InlineSpinner`, `EmptyState`, `ErrorState`, `RetryButton`, `OfflineState`, `UnavailableFeature`. Skeletons préservent les dimensions pour éviter CLS. Les erreurs partielles n’effacent pas toute la page. Une API absente affiche « fonctionnalité indisponible » derrière flag; jamais de données mock en production.

## 34. Feature rollout

Flags de build/runtime Web indépendants de l’API Admin : variables serveur ou configuration déployée validée, avec défaut désactivé. Familles : `webFeed`, `webDiscovery`, `webPlaces`, `webEvents`, `webSocial`, `webChat`, `webCommerce`, `webCulture`, `webPartner`. Les flags ne remplacent pas l’autorisation. Activation par environnement puis pourcentage/cohorte uniquement si un service fiable apparaît.

## 35. Migration landing `/about`

Avant : `/` → `LandingPage`. Après : `/` → Feed, `/about` → landing adaptée. Composants concernés : `components/landing/**`; actifs conservés. Les ancres deviennent `/about#...`; les liens `/` génériques sont requalifiés; les CTA « communauté » pointent vers register/explore au lieu de `/admin`. Metadata marketing descend dans le layout/page Marketing; canonical `/about`. Pas de redirect permanent de `/` puisque sa signification change; mettre à jour sitemap et liens externes.

## 36. Protection Admin

| Zone Admin | Risque Web | Protection architecturale |
|---|---|---|
| `/admin/login` | collision auth | group/routing Admin inchangé |
| middleware | garde publique accidentelle | matcher reste `/admin/:path*` |
| cookies | écrasement session | `yeyamo_admin_*` inchangés |
| session/refresh | provider User appelle Admin | routes et clients séparés |
| proxy | exposition endpoints | allowlist Admin inchangée |
| `/admin` dynamique | collision route groups | URLs publiques réservées |
| RBAC | Partner assimilé Admin | composants/providers distincts |
| CSS | styles publics globaux | scopes/classes/layers dédiés |
| QueryClient | cache keys en collision | namespaces de clés |
| Providers | fetch Admin sur public | migration vers scope Admin |
| finance | double submit | idempotency actuelle conservée |
| tests | régression silencieuse | suite Admin obligatoire par lot |

## 37. Sécurité

- XSS : React escaping, sanitation du riche, CSP stricte, aucun HTML arbitraire.
- CSRF : SameSite, validation Origin/Host et token CSRF pour mutations sensibles selon modèle retenu.
- Cookies : HttpOnly/Secure, scopes/noms séparés, rotation refresh.
- Cache : `private/no-store` pour session et privé; aucune donnée User dans cache partagé.
- IDOR : contrôle backend sur userId/partnerId/resource ownership.
- Redirect : validation stricte section 18.
- Upload/media : validation, quotas, scan, domaines allowlistés.
- WebSocket : ticket court ou cookie BFF; autorisation de channel serveur.
- CSP : `connect-src`, `img-src`, `media-src`, Mapbox et analytics minimaux.
- Logs : correlation ID; jamais jetons, OTP, documents ou payload paiement.

## 38. Accessibilité

Cible WCAG 2.2 AA : clavier complet, ordre logique, focus visible, skip link, landmarks, titres hiérarchiques, dialogs avec focus trap/restore, erreurs reliées aux champs, live regions parcimonieuses, contraste AA, touch target 44 px, sous-titres/transcriptions quand disponibles, contrôles vidéo accessibles, autoplay muted, `prefers-reduced-motion`, carte doublée d’une liste et contenu utilisable à 200 % de zoom.

## 39. Performance

Budgets initiaux : JS route publique hors framework ≤200 kB gzip souhaité; LCP p75 ≤2,5 s; INP ≤200 ms; CLS ≤0,1. Dynamic import pour Mapbox, charts, éditeurs, scanner et vidéo avancée. Virtualisation uniquement au-delà de listes mesurées; pagination avant virtualisation. Préfetch des liens visibles, pas de préfetch massif Feed. Séparer bundles Admin/Public/Partner via route groups. Images responsives, vidéo lazy, cache GET public selon fraîcheur métier.

## 40. Tests futurs

- Unit : URL/`next`, mappers, query keys, permissions, idempotency helpers.
- Component : ProtectedAction, dialogs, forms, media, states.
- Integration : BFF allowlists, login/session/refresh/logout, cookies, proxy isolation.
- E2E public : `/`, explore, place, event, SEO/direct URL.
- E2E auth : login + retour, like, draft commentaire, collection.
- E2E transaction : hold, double submit, refresh, callback.
- E2E Partner : garde, propriété, dashboard, création.
- E2E Admin : login, redirect, dashboard, dynamiques, RBAC, proxy, finance.
- Accessibility/performance : axe équivalent à évaluer, Lighthouse CI ou navigateur automatisé.

## 41. Convention URL

IDs opaques dans `[id]`; username sous `/@/[username]` pour éviter collisions. Noms anglais pluriels, kebab-case, pas de route group visible. Tabs utilisent search params seulement quand l’URL reste partageable (`?tab=`); modal d’action sans route sauf deep-link utile. `/profile` est propriétaire connecté; `/@/[username]` public. `/admin/**` et `/partner/**` ne se chevauchent pas. `/feed` n’est pas créé; une éventuelle redirection future vers `/` n’est pas nécessaire au lancement.

## 42. Navigation

Visiteur Desktop : Feed, Explorer, catégories majeures via Explorer, Login, Register. User : Feed, Explorer, Create, Messages, Notifications, Profile. Partner : accès « Espace partenaire » depuis profil/menu, puis navigation métier dédiée. Mobile : Feed, Explore, Create, Messages, Profile. Les sous-domaines Culture, Places, Events, Artisans et Artworks vivent dans Explorer et la recherche, pas dans une sidebar surchargée.

## 43. Create Action

Un `CreateMenu` cible est déclenché par bouton Desktop ou action centrale Mobile. User : post, story, event, contribution culture, artwork si éligible. Partner : post, story, event, place, offer, artwork. Le menu filtre selon capacités de session mais le backend autorise. Chaque option mène à une route de formulaire afin de supporter refresh/deep-link; le menu lui-même reste modal/drawer sans route.

## 44. Responsive par module

| Module | Mobile Web | Tablet | Desktop |
|---|---|---|---|
| Feed | média plein, bottom nav | rail + média | sidebar + média + panel optionnel |
| Post | page + comments sheet | split possible | post + comments |
| Explore | sections horizontales | grille 2–3 | filtres + grille |
| Search | input sticky + liste | catégories + grille | filtres + résultats typés |
| Map | map/liste alternées | split | split redimensionnable |
| Places/Events | cartes 1 colonne | 2 colonnes | 3–4 colonnes |
| Detail/Booking | CTA bottom sticky | 2 colonnes | CTA latéral sticky |
| Culture/Languages | lecture linéaire | rail secondaire | ReadingLayout + progression |
| Artisans/Artworks | grille 2 | grille 3 | galerie/grille 4 |
| Profile | tabs scrollables | header + 2 colonnes | header + tabs + panel |
| Messages | liste → thread | 2 panneaux | 3 panneaux |
| Collections/Tickets | cartes | cartes/table hybride | table/grille |
| Partner | menu + pages | rail + workspace | sidebar + workspace |

## 45. Dépendances

| Package/capacité | Classement | Usage |
|---|---|---|
| Next/React/TanStack/Zod | EXISTANT | fondation |
| Tailwind/clsx/cva/tailwind-merge | EXISTANT | styles/variants |
| Framer Motion | EXISTANT | mouvement avec parcimonie |
| Mapbox GL | EXISTANT | map |
| Recharts | EXISTANT | Partner charts |
| Lucide | EXISTANT | icônes |
| APIs Image/Video/Intersection/MediaDevices | EXISTANT navigateur | éviter package inutile |
| client Reverb/Pusher compatible Web | À ÉVALUER | dépend du protocole exact backend |
| validation upload avancée | À ÉVALUER | seulement si Zod + serveur insuffisants |
| lecteur QR | POTENTIELLEMENT NÉCESSAIRE | scanner Partner après évaluation BarcodeDetector |
| nouvelle librairie state globale | INUTILE | Query + context suffisent initialement |

## 46. Features architecture

```text
features/<domain>/
├── api/           clients BFF, server fetchers
├── components/    UI métier
├── hooks/         queries/mutations/client orchestration
├── types/         types frontend propres au domaine
├── schemas/       entrées/formulaires/runtime
├── mappers/       DTO ↔ modèle UI
└── query-keys.ts
```

Domaines : auth, feed, posts, stories, discovery, places, events, experiences, culture, languages, artisans, artworks, social, collections, messaging, profile, media, bookings, ticketing, payments, partner. Les features Admin existantes restent en place; migration seulement si utile et testée.

## 47. Data ownership

| Donnée | Propriétaire frontend |
|---|---|
| Post/Comment/Story | posts/stories; feed compose |
| Place/Activity | places |
| Event | events |
| Experience | experiences/catalog |
| CultureContent/Language/Challenge | culture/languages |
| Artisan/Artwork | artisans/artworks |
| Profile/Social relation | profile/social |
| Collection/Favorite | collections/interactions |
| Booking | bookings |
| Ticket/hold/order | ticketing |
| Payment | payments |
| Partner | partner |
| Media | media |
| Session | auth |

## 48. Roadmap technique

1. P0a : confirmer/ouvrir backend Feed, Stories, Discovery anonymes et leurs tests Gateway.
2. P0b : spécifier contrats et BFF Public/User; modèle cookies/CSRF.
3. P0c : isoler les providers Admin sans changement visuel/comportement.
4. P0d : créer route groups, Root/Public shell et design primitives après Prompt 3.
5. P0e : auth User, session, `next`, ProtectedAction.
6. P0f : Feed `/`, Post Detail, profil public.
7. P1a : Explore/Search; P1b : Places/Events/Experiences; P1c : Map.
8. P2a : interactions/collections; P2b : notifications; P2c : Chat.
9. P3 : booking, ticketing, payment, artwork orders.
10. P4 : culture/langues/défis; passport seulement après contrat.
11. P5 : Partner par verticales contrôlées.

Chaque lot inclut tests Admin non-régression et flag désactivable.

## 49. Estimation routes Web

| Type | Estimation | Notes |
|---|---:|---|
| pages statiques publiques/marketing/auth | 24 | hubs, listes, auth, pages éditoriales |
| routes dynamiques publiques | 15 | posts, stories, détails, usernames, lessons |
| pages privées User | 20 | listes, settings, create |
| routes dynamiques User | 6 | message, collection, ticket, order |
| pages Partner | 15 | hubs/workspaces |
| routes dynamiques Partner | 9 | détails/editors event/artwork/order/campaign |
| tabs sans page additionnelle | 12 | profil, details, dashboard |
| modals/drawers sans route | 8 types | create menu, auth action, filters, collection, share, comments mobile, confirmation, info |
| actions sans route | 20+ | like, follow, favorite, mutations |

Total cible initial : **environ 89 pages Next.js nouvelles**, dont 30 dynamiques, nettement moins que 166 interfaces Mobile. Le total final dépend des décisions de fusion du Prompt 3 et des contrats backend.

## 50. Estimation layouts/shells

- Layouts cibles : 6 fonctionnels + root; Admin existant inclus.
- Shells : Public, Auth User, Partner, Marketing, Admin existant (5).
- Variantes de contenu : Feed, Discovery, Detail, Reading, Chat, Form, Dashboard (7).
- Navigations : mobile bottom, tablet rail, desktop public sidebar, desktop Partner sidebar, Admin existante (5).
- Context panels : suggestions, comments, detail CTA, chat info, booking/ticket, none (6 variantes).
- Modals/drawers : create, auth-on-action, filters, collection, share, confirmation, mobile comments, partner scanner/info (8 familles).

## 51. ADR — décisions architecturales

| ADR | Décision | Justification | Conséquence | Alternative rejetée |
|---|---|---|---|---|
| 001 | Feed à `/` | décision produit | landing déplacée | `/feed` |
| 002 | Landing à `/about` | contenu marketing utile | metadata segmentée | suppression |
| 003 | Aucun onboarding | découverte immédiate | préférences non bloquantes | copie Mobile |
| 004 | Groups par contexte | isolation | plusieurs layouts | app plate |
| 005 | BFF Public + User | sécurité/frontières | deux façades | proxy Admin élargi |
| 006 | Cookies User dédiés | tokens hors JS | routes auth User | localStorage |
| 007 | Partner sur session User | modèle backend | garde métier | cookies Partner |
| 008 | Admin inchangé | produit existant | tests non-régression | refonte commune |
| 009 | RSC par défaut | SEO/performance | îlots clients | tout `use client` |
| 010 | URL canonique détails | partage/SEO | overlays interceptables | modal-only |
| 011 | contrats générés/partagés | éviter divergence | discipline version | copies manuelles |
| 012 | pas de mocks prod | factualité | unavailable states | fallback fictif |
| 013 | flags Web indépendants | API Admin flags absente | config déploiement | dépendance bloquante |
| 014 | transactions non optimistes | intégrité | confirmations backend | optimistic finance |

## 52. Risques bloquants

| Priorité | Risque/vérification | Preuve | Condition de sortie |
|---|---|---|---|
| P0 BLOCKER | Feed anonyme refusé | absent Gateway allowlist | GET feed public testé |
| P0 BLOCKER | Discovery anonyme refusé | absent Gateway allowlist | GET search/trending public testé |
| P0 BLOCKER | Stories anonymes refusées | absent Gateway allowlist | règles lecture/view clarifiées |
| P0 BLOCKER | Auth User cookies/CSRF non spécifiée | seul modèle Admin existe | ADR sécurité validé |
| P0 BLOCKER | Providers Admin globaux | `app/providers.tsx` | plan de scoping + tests |
| P1 IMPORTANT | profils username vs UUID | Gateway public UUID | résolution username contractuelle |
| P1 IMPORTANT | ticket types public | contrôleur observé, Gateway incertain | test end-to-end Gateway |
| P1 IMPORTANT | protocole socket Web | Reverb Mobile | handshake/auth documentés |
| P1 IMPORTANT | domaines CDN médias | config Next sans images config | liste domaines validée |
| P1 IMPORTANT | contrats incomplets passport/reviews | audit Prompt 1 | endpoints ou flags |
| P2 NON BLOQUANT | Web Push | uniquement mobile aujourd’hui | phase dédiée |
| P2 NON BLOQUANT | scanner QR navigateur | caméra native Mobile | compatibilité/fallback |

## 53. Recommandations pour le Prompt 3

Le Prompt 3 doit définir les tokens sémantiques, primitives accessibles, breakpoints, grilles, shells, densités, états, media cards et patrons responsive avant toute page. Il doit partir des sept variantes de contenu de ce document et démontrer Feed, Detail, Discovery, Chat et Partner aux trois tailles. Il doit aussi préciser la stratégie de migration de `globals.css` et de scoping des providers Admin, sans implémenter les modules métier.

## 54. Conclusion

L’architecture cible est compatible avec le repository actuel sans séparation en nouveau projet. Son succès dépend de trois préconditions : ouvrir les GET stratégiques réellement publics au Gateway, créer une auth/BFF User isolée, et désimbriquer les providers Admin du scope global sans régression. Après ces sécurisations, Yeyamo peut évoluer verticalement par fonctionnalités, avec un Feed public à `/`, une landing conservée à `/about`, un Partner distinct et un Admin intact.
