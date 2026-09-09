# Architecture Auth User, Session, Partner et Auth-on-action — Yeyamo Web

## 1. Résumé exécutif

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : Yeyamo Web adopte un BFF User same-origin distinct du BFF Admin, avec JWT d’accès et refresh token conservés exclusivement dans des cookies `HttpOnly`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : les pages publiques restent accessibles sans session; les mutations sensibles déclenchent une authentification contextuelle puis restaurent et rejouent une intention contrôlée.
- **EXISTANT** : Mobile utilise les contrats `/api/v1/auth/**`, stocke les jetons dans SecureStore et effectue une rotation du refresh token; Admin possède déjà son propre BFF et ses cookies.
- **DÉCISION** : un Partner est le même User auquel est rattachée une entité Partner; le rôle `PARTNER` est ajouté après approbation.
- **P0** : ne jamais exposer les jetons au JavaScript, isoler strictement Admin/User, traiter les courses de refresh et fermer les écarts de contrat avant Prompt 5.

## 2. Sources analysées

- **EXISTANT** : `AUDIT_ALIGNEMENT_MOBILE_WEB.md`, `ARCHITECTURE_YEYAMO_WEB.md` et `DESIGN_SYSTEM_RESPONSIVE_YEYAMO_WEB.md` ont été relus intégralement.
- **EXISTANT** : audit ciblé de Mobile (`auth.api`, `auth.service`, store, SecureStore, Turnstile, Google OAuth, client HTTP), du Web/Admin et des services backend Auth/Partner.
- **À VÉRIFIER** : durées JWT exactes par environnement, domaines finaux, configuration OAuth Web, hostname Turnstile et politique produit « remember me ».

## 3. Auth actuelle Mobile

- **EXISTANT** : login, register, logout, `/auth/me`, refresh, vérification email, récupération de mot de passe, changement de mot de passe et OAuth Google/Apple.
- **EXISTANT** : les jetons access/refresh sont persistés dans SecureStore; le store Zustand garde aussi l’access token en mémoire.
- **EXISTANT** : un mutex de refresh rejoue une requête après `401`; un échec efface la session, coupe Reverb et déclenche le flux unauthenticated.
- **EXISTANT** : Turnstile est requis pour login/register et utilisé pour renvoi OTP/forgot password.
- **INTERDIT WEB** : ne pas reproduire les modes démo ni stocker les jetons dans `localStorage`, `sessionStorage`, Zustand persisté ou état React lisible par JavaScript.

## 4. Auth actuelle Admin

- **EXISTANT** : routes `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/session`; cookies `yeyamo_admin_access`, `yeyamo_admin_refresh`, `yeyamo_admin_user`.
- **EXISTANT** : seuls les rôles privilégiés `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `EDITOR`, `SUPPORT`, `COMMERCIAL` ouvrent une session Admin.
- **EXISTANT** : middleware `/admin/**`, proxy backend allowlisté, refresh mutualisé et `SessionProvider` global.
- **RISQUE EXISTANT** : le cookie résumé Admin peut devenir obsolète; il ne doit jamais être une source d’autorisation.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : cantonner le provider Admin au layout Admin et ne partager aucun cookie, endpoint, cache ou état avec User.

## 5. Modèle User/Partner réel

- **EXISTANT** : `User` porte des rôles, dont `USER` et éventuellement `PARTNER`.
- **EXISTANT** : l’entité Partner est séparée, identifiée par UUID et liée au User par `ownerUserId`.
- **EXISTANT** : l’événement `partner.approved` ajoute le rôle `PARTNER` au même User.
- **DÉCISION** : retenir **C — même User + rôle PARTNER après approbation**; ce n’est ni un compte séparé ni un simple profil sans lifecycle.
- **À VÉRIFIER** : retrait effectif du rôle lors de `SUSPENDED` ou `DELETED`; le Web ne doit pas déduire ce comportement.

## 6. Sessions cibles

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : session navigateur stateless côté BFF, adossée au couple access JWT + refresh opaque rotatif backend.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : le navigateur ne reçoit jamais les jetons dans les réponses JSON; le BFF renvoie seulement un `SessionView` minimal.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : une session User et une session Admin peuvent coexister sans interaction.
- **RECOMMANDATION SÉCURITÉ** : source d’autorité = `/auth/me` et contrôles backend, jamais un cookie résumé ni un rôle seulement présent côté client.

## 7. Cookies User

| Cookie cible | HttpOnly | Secure | SameSite | Path | Durée | Usage |
|---|---:|---:|---|---|---|---|
| `yeyamo_user_access` | oui | production | `Lax` | `/` | `expiresIn` backend | appels BFF et SSR optionnel |
| `yeyamo_user_refresh` | oui | production | `Strict` | `/api/user/auth` | TTL backend | rotation uniquement |
| `yeyamo_user_csrf` | non | production | `Strict` | `/api/user` | session courte | double-submit CSRF |

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : cookies host-only, sans `Domain`, préfixables `__Host-` en production si les contraintes de `Path=/` sont retenues.
- **DÉCISION** : aucun cookie résumé User; `/api/user/session` produit la vue depuis `/auth/me` pour éviter dérive et falsification.
- **RECOMMANDATION SÉCURITÉ** : `Cache-Control: no-store`, `Pragma: no-cache`, suppression symétrique avec les mêmes attributs.

## 8. Isolation Admin

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : namespace User `/api/user/**`; namespace Admin existant `/api/auth/**` et `/api/backend/**`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : noms de cookies, refresh mutex, providers, clés TanStack Query et redirections totalement distincts.
- **RECOMMANDATION SÉCURITÉ** : le BFF User refuse les cookies Admin et réciproquement; aucun fallback d’un espace vers l’autre.
- **RECOMMANDATION SÉCURITÉ** : CSP, logs et métriques différencient `auth_surface=user|admin`.

## 9. Routes Auth User cibles

Toutes les routes de ce tableau sont **ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE**.

| Méthode | Route Web | Backend | Auth |
|---|---|---|---|
| POST | `/api/user/auth/login` | `/api/v1/auth/login` | publique + CSRF/Origin |
| POST | `/api/user/auth/register` | `/api/v1/auth/register` | publique + CSRF/Origin |
| POST | `/api/user/auth/logout` | `/api/v1/auth/logout` | User |
| POST | `/api/user/auth/refresh` | `/api/v1/auth/refresh` | refresh cookie |
| POST | `/api/user/auth/oauth/google` | `/api/v1/auth/oauth/google` | publique |
| POST | `/api/user/auth/oauth/apple` | `/api/v1/auth/oauth/apple` | publique |
| POST | `/api/user/auth/email/verification/request` | route homonyme | publique |
| POST | `/api/user/auth/email/verification/confirm` | route homonyme | publique |
| POST | `/api/user/auth/password/forgot` | route homonyme | publique |
| POST | `/api/user/auth/password/reset` | route homonyme | publique |
| PUT | `/api/user/auth/password` | `/api/v1/auth/password` | User + réauth recommandée |
| POST | `/api/user/auth/account/deactivate` | route homonyme | User + réauth |
| GET | `/api/user/auth/sessions` | `/api/v1/auth/sessions` | User |
| DELETE | `/api/user/auth/sessions/[sessionId]` | `/api/v1/auth/sessions/{id}` | User |
| GET | `/api/user/session` | `/api/v1/auth/me` | session optionnelle |

## 10. BFF User

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : Route Handlers Next.js lisent les cookies `HttpOnly`, ajoutent `Authorization: Bearer`, normalisent les erreurs et filtrent les réponses.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : helper serveur unique `userBackendFetch`, sans duplication de logique de cookies/refresh.
- **RECOMMANDATION SÉCURITÉ** : allowlist de chemins et méthodes; aucune URL backend fournie par le client.
- **DÉCISION** : le BFF est une frontière de confiance, pas un proxy ouvert.

## 11. BFF Public

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `/api/public/**` reste sans session obligatoire et n’envoie aucun cookie User au backend par défaut.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : seules les pages nécessitant une personnalisation optionnelle appellent un endpoint dédié, explicitement session-aware.
- **RECOMMANDATION SÉCURITÉ** : ne jamais mélanger cache public partagé et réponse personnalisée.

## 12. Login

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : page `/login`, formulaire identifiant + mot de passe + Turnstile, action BFF same-origin.
- **EXISTANT BACKEND** : `identifier` max 254, mot de passe 8–128 au login, `turnstileToken` requis.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : succès = cookies écrits, session invalidée/rechargée, intention restaurée ou redirection sûre.
- **RECOMMANDATION SÉCURITÉ** : message générique pour credentials, temporisation uniforme et aucune journalisation du secret.

## 13. Register

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : page `/register` avec email ou téléphone, mot de passe 12–128, displayName, pays, ville, langue, fuseau et Turnstile.
- **EXISTANT BACKEND** : téléphone E.164, pays ISO alpha-2, email max 254; le backend renvoie immédiatement une `AuthResponse`.
- **ÉCART EXISTANT** : `username` et `password_confirmation` existent dans certains types Mobile mais ne sont pas envoyés au backend.
- **À VÉRIFIER** : règle produit email/téléphone obligatoire et attribution officielle du username avant d’exposer `/@/[username]`.

## 14. Verification

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `/verify-email` accepte email + OTP; renvoi OTP protégé par Turnstile.
- **EXISTANT BACKEND** : request `/email/verification/request`, confirm `/email/verification/confirm`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : l’UI conserve l’email dans un état transitoire non secret ou une query signée/validée, jamais l’OTP.
- **RECOMMANDATION SÉCURITÉ** : expiration, compteur de renvoi, messages non énumérants et rate limit par compte/IP.

## 15. Password recovery

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `/forgot-password` demande l’email + Turnstile; `/reset-password` soumet email, OTP, nouveau mot de passe.
- **EXISTANT BACKEND** : contrats `/password/forgot` et `/password/reset`.
- **RECOMMANDATION SÉCURITÉ** : réponse identique qu’un compte existe ou non; révoquer toutes les sessions après reset.
- **À VÉRIFIER** : le backend révoque-t-il déjà toutes les sessions après reset.

## 16. OAuth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : Google Web récupère un ID token auprès du provider puis l’échange via le BFF contre la session Yeyamo.
- **EXISTANT BACKEND** : `/oauth/google` et `/oauth/apple` acceptent `idToken`; validation issuer/audience/authorized party côté backend.
- **RECOMMANDATION SÉCURITÉ** : PKCE/state/nonce lorsque le SDK/provider le permet, origin autorisée stricte et aucun token provider dans URL/log.
- **À VÉRIFIER** : client IDs Web, redirect URIs, Apple Web Services ID et règles de consentement.

## 17. Session endpoint

- **ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE** : `GET /api/user/session`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : réponse `{ authenticated, user?, partner?, capabilities, expiresAt? }`, sans jeton ni donnée KYC.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `200 authenticated:false` sans cookie valide; `no-store` systématique.
- **DÉCISION** : un access expiré peut déclencher un refresh serveur mutualisé une seule fois.

## 18. Providers

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `UserSessionProvider` limité au shell public/authentifié qui en a besoin; `AdminSessionProvider` limité au layout Admin.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : le provider expose session, état `loading/authenticated/anonymous`, `refreshSession`, `logout`; jamais les tokens.
- **RECOMMANDATION** : éviter un provider global sur les pages publiques purement SEO.

## 19. Server session

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `getServerUserSession()` lit le cookie access côté serveur et appelle `/auth/me` seulement lorsque nécessaire.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : layouts privés bloquent avant rendu; pages publiques peuvent rendre sans cette lecture.
- **RECOMMANDATION SÉCURITÉ** : `cache: 'no-store'`, aucune mise en cache React partagée d’une session entre requêtes.

## 20. Client session

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : TanStack Query utilise `['user-session']`, `staleTime` court, `refetchOnWindowFocus` raisonné et endpoint same-origin.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : aucun token dans le cache; uniquement le `SessionView` minimal.
- **DÉCISION** : l’état client améliore l’UX mais ne décide jamais l’autorisation backend.

## 21. User route guards

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : layouts privés (`/me`, commandes, favoris privés, paramètres) vérifient la session côté serveur.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : absence de session -> `/login?next=...`; session invalide -> cookies supprimés puis même flux.
- **RECOMMANDATION SÉCURITÉ** : middleware éventuel uniquement comme préfiltre UX, jamais comme contrôle final.

## 22. Partner route guards

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : le dashboard Partner requiert User authentifié puis charge `GET /partners/me`.
- **DÉCISION** : accès selon statut, pas seulement rôle; `DRAFT/NEEDS_INFO/REQUIRES_CHANGES/REJECTED` permettent édition, `SUBMITTED/UNDER_REVIEW` lecture, `APPROVED` exploitation.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `SUSPENDED/DELETED` bloquent les opérations Partner et affichent un état explicite.
- **À VÉRIFIER** : politique exacte de consultation pour `REJECTED` et de recours pour `SUSPENDED`.

## 23. Auth-on-action

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : un visiteur peut naviguer; l’auth est demandée seulement lorsqu’une action protégée est engagée.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : capture d’intention serveur, modal ou page contextuelle, authentification, restauration du contexte puis confirmation/rejeu.
- **DÉCISION** : aucune mutation n’est effectuée avant confirmation d’une session valide.

## 24. Protected action levels

| Niveau | Exemples | Exigence cible |
|---|---|---|
| L0 public | rechercher, consulter | aucune session |
| L1 personnel | favoris, follow, avis brouillon | session User |
| L2 transactionnel | réservation, commande, paiement | session + email vérifié + confirmation |
| L3 sensible | mot de passe, désactivation, KYC | session récente + réauth + CSRF fort |
| L4 Partner | gestion catalogue/établissement | capability + statut Partner compatible |

## 25. Intent model

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `AuthIntent = { id, action, resourceType, resourceId, safePayloadRef?, next, createdAt, expiresAt, nonce }`.
- **RECOMMANDATION SÉCURITÉ** : stocker côté serveur ou dans un blob signé/chiffré `HttpOnly`; ne jamais placer payload sensible ou prix dans la query.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : TTL 10 minutes, usage unique, liaison au navigateur et validation du resourceId au replay.

## 26. `next`

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `next` n’accepte qu’un chemin relatif commençant par `/`, sans `//`, schéma, backslash ni hôte.
- **RECOMMANDATION SÉCURITÉ** : parseur central; fallback `/`; longueur plafonnée; décodage unique.
- **INTERDIT** : redirection directe vers une valeur client non validée.

## 27. Context restoration

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : restaurer ressource, variante, quantité, étape et ancre à partir de l’intention validée.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : recharger prix, disponibilité, droits et statut depuis le backend avant toute mutation.
- **DÉCISION** : un contexte devenu invalide revient à la page ressource avec message, sans action automatique.

## 28. Contextual Auth UI

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : desktop utilise une modal accessible; mobile utilise une page/full-screen sheet cohérente avec le design system.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : titre orienté action (« Connectez-vous pour réserver »), choix login/register/OAuth et retour explicite.
- **RECOMMANDATION** : ne pas masquer le contexte ni employer une auth générique lorsque l’action d’origine est connue.

## 29. Direct vs contextual login

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `/login` direct redirige vers `next` sûr ou `/`; login contextuel restaure une intention.
- **DÉCISION** : même backend et mêmes composants de formulaire, orchestration différente.
- **RECOMMANDATION** : analytics distincts `auth_entry=direct|action`.

## 30. Action replay

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : replay automatique seulement pour actions idempotentes/faible risque (favori, follow) avec clé d’idempotence.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : réservation, commande, paiement, avis publié et KYC exigent une confirmation après login.
- **RECOMMANDATION SÉCURITÉ** : nonce consommé atomiquement, contrôle ownership/capability et nouvelle lecture métier.

## 31. CSRF

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : méthodes unsafe exigent `Origin` same-origin, `Sec-Fetch-Site` compatible et header `X-CSRF-Token` égal au cookie signé double-submit.
- **RECOMMANDATION SÉCURITÉ** : token CSRF renouvelé à login/refresh, comparaison constante, rejet si Origin absent hors exceptions documentées.
- **EXISTANT BACKEND** : CSRF Spring est désactivé car API Bearer stateless; la protection doit donc être appliquée au BFF cookie-based.

## 32. XSS/token leakage

- **RECOMMANDATION SÉCURITÉ** : tokens uniquement `HttpOnly`; CSP stricte avec nonces, Trusted Types si possible, aucune interpolation HTML non nettoyée.
- **RECOMMANDATION SÉCURITÉ** : masquer cookies, Authorization, OTP, password et ID token dans logs, Sentry, traces et analytics.
- **RECOMMANDATION SÉCURITÉ** : dépendances OAuth/Turnstile minimales, scripts tiers allowlistés, pas de token dans URL.

## 33. Refresh

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : rotation via BFF avec mutex serveur/process local et déduplication client par surface.
- **EXISTANT BACKEND** : rotation révoque l’ancien refresh; sa réutilisation déclenche `REFRESH_TOKEN_REUSE_DETECTED` et révoque toutes les sessions du User.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : écriture atomique des deux nouveaux cookies; aucune réponse JSON avec token.
- **À VÉRIFIER** : coordination distribuée si plusieurs instances BFF traitent simultanément le même navigateur.

## 34. 401

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : sur `401` d’une requête authentifiée, une seule tentative de refresh puis un seul replay.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : échec refresh = purge cookies, invalidation session et retour `AUTH_REQUIRED` avec intention conservée si sûre.
- **INTERDIT** : boucle de refresh sur endpoints auth ou plus d’un replay.

## 35. 403

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : ne jamais refresh automatiquement; mapper en `EMAIL_VERIFICATION_REQUIRED`, `PARTNER_REQUIRED`, `PARTNER_STATUS_BLOCKED`, `ACCOUNT_DISABLED` ou `FORBIDDEN`.
- **DÉCISION** : `401` signifie identité absente/invalide; `403` identité connue mais action interdite.

## 36. Logout

- **ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE** : `POST /api/user/auth/logout`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : appel backend best-effort, suppression immédiate de tous les cookies User, invalidation des queries User et déconnexion WebSocket/Push.
- **DÉCISION** : ne touche jamais aux cookies ni à la session Admin.

## 37. Multi-tab

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `BroadcastChannel('yeyamo-user-auth')` diffuse `login`, `logout`, `session-changed` sans jeton.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : chaque onglet invalide `['user-session']`; un leader ou verrou navigateur réduit les refresh concurrents.
- **RECOMMANDATION SÉCURITÉ** : ne jamais transmettre payload utilisateur sensible dans BroadcastChannel.

## 38. Session expiry UX

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : expiration silencieusement récupérable -> refresh sans interruption; expiration définitive -> message clair et login contextuel.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : préserver seulement les brouillons non sensibles localement; aucune mutation silencieuse après réauth.
- **RECOMMANDATION** : bannière préalable uniquement si `expiresAt` fiable est exposé.

## 39. Partner elevation

- **EXISTANT** : création Partner en `DRAFT`, soumission, revue, approbation; l’approbation ajoute le rôle `PARTNER` de façon événementielle.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : après approbation, recharger `/auth/me` et `/partners/me`; ne pas attendre une reconnexion manuelle.
- **À VÉRIFIER** : délai/eventual consistency et stratégie de retry lorsque rôle et statut divergent temporairement.

## 40. User+Admin simultaneous session

- **DÉCISION** : coexistence autorisée dans le même navigateur grâce aux namespaces distincts.
- **RECOMMANDATION SÉCURITÉ** : aucune élévation implicite User depuis Admin, ni Admin depuis User; authentifications et logout séparés.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : avertissement visuel éventuel dans Admin, sans exposer l’identité User.

## 41. Cache/session

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : endpoints session/auth = `private, no-store`; aucune CDN cache.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : clés de cache incluent explicitement la surface; purge des caches privés à logout/changement de rôle.
- **RECOMMANDATION SÉCURITÉ** : ne jamais utiliser une réponse personnalisée dans ISR ou cache partagé.

## 42. SSR Auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : SSR réservé aux routes privées et éléments réellement personnalisés.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : les pages publiques SEO restent publiques; les CTA s’hydratent avec session optionnelle si nécessaire.
- **DÉCISION** : ne pas rendre toute l’application dynamique pour afficher un avatar.

## 43. Optional session public pages

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : produit/restaurant/profil public se rend anonymement; état favori/follow chargé ensuite via endpoint privé dédié.
- **RECOMMANDATION** : conserver HTML et métadonnées identiques pour bots et humains, sans cloaking.
- **RECOMMANDATION SÉCURITÉ** : réponse optionnelle privée séparée du cache de contenu public.

## 44. Authorization

- **DÉCISION** : autorisation finale dans les microservices; le BFF et l’UI ne font que défense en profondeur/UX.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : contrôles par rôle, ownership, statut ressource, statut compte, statut Partner et niveau de vérification.
- **INTERDIT** : autoriser une action parce qu’un bouton était visible ou parce que `roles` client contient une valeur.

## 45. Capabilities

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : dériver des capabilities stables (`canFavorite`, `canOrder`, `canManagePartner`, `canUploadKyc`) côté serveur.
- **DÉCISION** : capabilities utiles à l’UI, mais le backend recalcule toujours les droits.
- **À VÉRIFIER** : endpoint backend agrégé; en son absence, le BFF combine prudemment `/auth/me` et `/partners/me`.

## 46. Auth errors

- **EXISTANT** : codes observés notamment `INVALID_CREDENTIALS`, `EMAIL_ALREADY_USED`, `EMAIL_NOT_VERIFIED`, `ACCOUNT_DISABLED`, `INVALID_REFRESH_TOKEN`, `REFRESH_TOKEN_REUSE_DETECTED`, `SESSION_NOT_FOUND` et erreurs Turnstile/OAuth.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : enveloppe Web `{ code, message, fieldErrors?, correlationId?, retryable }` sans détail interne.
- **DÉCISION** : mapping central et exhaustif; fallback neutre localisé.

## 47. Enumeration protection

- **RECOMMANDATION SÉCURITÉ** : login conserve `INVALID_CREDENTIALS` générique; forgot/resend répondent de manière identique que le compte existe ou non.
- **RECOMMANDATION SÉCURITÉ** : ne pas révéler provider OAuth lié, email vérifié, statut ou existence via timing/message.
- **À VÉRIFIER** : harmonisation backend des réponses `USER_NOT_FOUND` sur flows publics.

## 48. Rate limiting

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : limites par IP + identifiant haché + device/session sur login, register, OTP, forgot, reset, OAuth et refresh.
- **RECOMMANDATION SÉCURITÉ** : fenêtres glissantes, backoff, `Retry-After`, stockage distribué et métriques sans PII.
- **À VÉRIFIER** : limites déjà appliquées par Gateway/WAF et `LoginAttemptService` pour éviter doublons incohérents.

## 49. Turnstile

- **EXISTANT** : backend exige le token sur login/register et vérifie hostname/action; Mobile l’utilise aussi sur resend/forgot.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : widget Web officiel, site key publique via env, token usage unique transmis seulement au BFF/backend.
- **RECOMMANDATION SÉCURITÉ** : secret uniquement backend; actions distinctes `login`, `register`, `resend_otp`, `forgot_password`.
- **À VÉRIFIER** : hostnames production/preview et politique adaptative versus token toujours requis par les DTO actuels.

## 50. Email verification

- **EXISTANT** : User expose `emailVerifiedAt`; login peut retourner `EMAIL_NOT_VERIFIED`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : session expose `emailVerified`; actions L2 peuvent rediriger vers vérification en conservant l’intention.
- **DÉCISION** : un compte non vérifié n’est pas traité comme anonyme; capacités réduites et message explicite.

## 51. Account statuses

- **EXISTANT** : `PENDING`, `ACTIVE`, `SUSPENDED`, `BLOCKED`, `DEACTIVATED`, `LOCKED`, `BANNED`, `INACTIVE`, `DELETED`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `ACTIVE` normal; `PENDING` limité; autres statuts refusent login/actions selon politique backend.
- **RECOMMANDATION** : l’UI mappe chaque statut autorisé sans inventer la possibilité d’appel ou de réactivation.
- **À VÉRIFIER** : sémantique métier exacte de `LOCKED`, `INACTIVE` et `PENDING`.

## 52. Deleted account

- **EXISTANT** : endpoint de désactivation, statut User `DELETED` et statut Partner `DELETED` existent, mais suppression et désactivation sont distinctes.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : compte supprimé/désactivé ferme toutes les sessions, retire les caches et bloque les actions.
- **À VÉRIFIER** : rétention légale, anonymisation, délai de restauration et différence exacte `DEACTIVATED`/`DELETED`.

## 53. SEO Auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : pages login/register/forgot/reset/verify utilisent `noindex, follow`, canonical propre et métadonnées sobres.
- **RECOMMANDATION** : ne jamais mettre email, OTP, `next` sensible ou erreurs de compte dans titre, canonical ou données structurées.

## 54. SEO Private

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : toutes les routes User/Partner privées sont `noindex, nofollow`, non sitemap et `Cache-Control: private, no-store`.
- **RECOMMANDATION SÉCURITÉ** : une redirection auth ne doit pas révéler l’existence d’une ressource privée.

## 55. Deep links

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : liens Web/Mobile utilisent chemins canoniques relatifs et paramètres allowlistés.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : login Web peut restaurer un deep link Web sûr; passage vers Mobile via Universal/App Links vérifiés.
- **RECOMMANDATION SÉCURITÉ** : signature et expiration pour liens portant une intention; jamais de jeton de session.

## 56. OAuth return

- **ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE** : callback/return interne selon SDK choisi, puis échange ID token via `/api/user/auth/oauth/{provider}`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : valider `state`, `nonce`, provider attendu et `next`; supprimer les paramètres OAuth de l’URL après traitement.
- **À VÉRIFIER** : Google Identity Services vs flux Authorization Code PKCE et compatibilité Apple.

## 57. Query invalidation

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : login/refresh invalidant session et données personnalisées; logout supprime toutes les queries User.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : élévation Partner invalide session, partner, navigation et permissions; Admin reste intact.
- **RECOMMANDATION** : factory de clés séparée `userKeys`, `partnerKeys`, `adminKeys`.

## 58. WebSocket auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : endpoint BFF émet un ticket WebSocket court, audience/scopes limités; le JWT principal n’est pas mis dans l’URL.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : refresh/reconnexion à expiration; logout ferme le socket.
- **À VÉRIFIER** : capacité actuelle de Reverb/Gateway à accepter cookie same-origin ou ticket éphémère.

## 59. Web Push auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : abonnement push enregistré via BFF authentifié et lié au User/device; désabonnement à logout best-effort.
- **RECOMMANDATION SÉCURITÉ** : clés VAPID publiques seulement au client, endpoint d’inscription protégé CSRF et validation stricte de l’URL push.
- **À VÉRIFIER** : partage ou séparation des abonnements Mobile et Web.

## 60. Upload auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : upload KYC exige session User, ownership Partner, statut éditable et CSRF.
- **EXISTANT BACKEND** : Partner accepte multipart et valide type/contenu/nom; documents éditables seulement dans les statuts autorisés.
- **RECOMMANDATION SÉCURITÉ** : limites taille/type, scan malware, stockage privé, URL signée courte, aucune mise en cache publique.

## 61. Transaction auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : réservation/commande/paiement exigent User, email vérifié, recalcul serveur, idempotency key et confirmation explicite.
- **RECOMMANDATION SÉCURITÉ** : réauth ou challenge renforcé pour montant/risque élevé; ne jamais rejouer automatiquement un paiement.
- **À VÉRIFIER** : règles métier et SCA des services transactionnels.

## 62. Audit logging

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : journaliser login succès/échec, refresh reuse, logout, reset, changement mot de passe, révocation session, élévation Partner et action L3/L4.
- **RECOMMANDATION SÉCURITÉ** : correlation ID, user ID pseudonymisé, IP tronquée/traitée, user-agent normalisé; aucun secret/OTP/token.
- **DÉCISION** : logs immuables, rétention définie et accès restreint.

## 63. Security headers

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : CSP nonce-based, `frame-ancestors 'none'` sauf besoin Turnstile isolé, HSTS, `nosniff`, Referrer-Policy stricte, Permissions-Policy minimale.
- **RECOMMANDATION SÉCURITÉ** : `Cross-Origin-Opener-Policy` compatible OAuth popup et `Cross-Origin-Resource-Policy` testé avec assets/providers.
- **À VÉRIFIER** : exceptions requises par Google, Apple, Turnstile, paiements et médias.

## 64. Same-origin

- **DÉCISION** : navigateur -> Yeyamo Web same-origin -> BFF -> Gateway; aucun appel direct du navigateur aux microservices authentifiés.
- **RECOMMANDATION SÉCURITÉ** : CORS backend n’est pas une barrière d’autorisation; BFF valide Origin/Host et construit lui-même l’URL upstream.

## 65. Cookie domain

- **DÉCISION** : cookies host-only, sans `Domain`, afin d’empêcher les sous-domaines frères de les recevoir.
- **RECOMMANDATION SÉCURITÉ** : si Web et Admin sont sur le même host, les noms/paths restent distincts; idéalement Admin sur un host dédié.
- **À VÉRIFIER** : topologie finale `www`, apex, admin et previews avant fixation des attributs.

## 66. Remember me

- **EXISTANT** : aucun champ `rememberMe` observé dans les contrats Auth.
- **DÉCISION** : ne pas simuler cette option en allongeant un cookie au-delà du refresh backend.
- **À VÉRIFIER** : si produit l’exige, ajouter un contrat backend explicite avec TTL, consentement et révocation différenciés.

## 67. Session management

- **EXISTANT BACKEND** : `GET /auth/sessions` retourne `id`, `expiresAt`, `revokedAt`, `active`; `DELETE /auth/sessions/{id}` révoque une session.
- **ROUTES CIBLES — NON ENCORE IMPLÉMENTÉES** : `GET /api/user/auth/sessions`, `DELETE /api/user/auth/sessions/[sessionId]`.
- **LIMITATION EXISTANTE** : le DTO ne contient ni device, IP, date de création ni indicateur « session courante ».
- **À VÉRIFIER** : enrichir backend avant une UI de gestion de sessions réellement compréhensible.

## 68. Password change

- **ROUTE CIBLE — NON ENCORE IMPLÉMENTÉE** : `PUT /api/user/auth/password` avec `currentPassword`, `newPassword`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : réauth récente, CSRF fort, validation client alignée backend, notification de sécurité.
- **À VÉRIFIER** : révocation des autres sessions et conservation de la session courante.

## 69. Reauthentication

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : challenge mot de passe ou OAuth récent pour changement mot de passe, désactivation, données KYC critiques et actions financières risquées.
- **RECOMMANDATION SÉCURITÉ** : preuve courte (5–10 min), liée à l’action et au User, consommée côté serveur.
- **À VÉRIFIER** : endpoint backend de réauth dédié absent; à concevoir avant implémentation L3.

## 70. Auth state machine

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : `unknown -> anonymous -> authenticating -> authenticated -> refreshing -> authenticated`.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : branches `verification_required`, `reauth_required`, `partner_pending`, `expired`, `error`, puis retour contrôlé.
- **DÉCISION** : une seule transition de refresh active; logout est terminal pour la génération de session courante.

## 71. Race conditions

- **RISQUE** : refresh simultané multi-requêtes/multi-onglets peut réutiliser un token révoqué et provoquer la révocation globale backend.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : mutex par session côté BFF, verrou navigateur, réponse refresh atomique et génération de session.
- **RECOMMANDATION SÉCURITÉ** : ignorer toute réponse ancienne après logout/login grâce à un `sessionEpoch` non secret.
- **À VÉRIFIER** : besoin d’un lock distribué Redis en environnement multi-instance.

## 72. Offline auth

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : hors ligne, afficher le contenu public déjà disponible et les brouillons locaux; ne pas considérer la session comme validée.
- **DÉCISION** : aucune mutation protégée ni replay transactionnel avant reconnexion et revalidation.
- **RECOMMANDATION SÉCURITÉ** : ne pas mettre les réponses privées sensibles dans Cache Storage/service worker.

## 73. Auth metrics

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : taux succès/échec login, register, OAuth, Turnstile, refresh, OTP, reset, durée auth et abandons par étape.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : métriques auth-on-action par action, modal/page, restauration réussie et conversion finale.
- **RECOMMANDATION SÉCURITÉ** : cardinalité maîtrisée, identifiants hachés, aucun email/token/OTP.

## 74. Auth-on-action conversion

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : funnel `action_started -> auth_shown -> auth_success -> context_restored -> action_confirmed -> action_success`.
- **DÉCISION** : comparer direct/contextuel, login/register/OAuth, type d’action et viewport sans profiler des catégories sensibles.
- **RECOMMANDATION** : mesurer aussi erreurs, expiration d’intention et annulations volontaires.

## 75. OAuth account merge

- **RISQUE** : un email existant et un nouveau provider peuvent créer doublon ou permettre un rattachement abusif.
- **RECOMMANDATION SÉCURITÉ** : fusion uniquement si email provider vérifié et politique backend explicite; sinon demander connexion/réauth du compte existant.
- **À VÉRIFIER** : comportement actuel d’`AuthService.oauthLogin`, unicité provider subject et procédure de unlink.

## 76. Username routing

- **EXISTANT** : le Mobile fabrique un username d’affichage local; `UserResponse` backend ne garantit pas ce champ.
- **BLOQUEUR** : `/@/[username]` exige slug unique, stable, insensible à la casse, réservé et résolu côté backend.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : endpoint public de résolution username -> user UUID avec redirection canonique lors d’un changement.
- **À VÉRIFIER** : source de vérité, historique, mots réservés et politique de renommage.

## 77. Partner routing

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : routes publiques Partner par slug/UUID canonique; espace propriétaire sous `/partner/**` ou convention validée par l’architecture globale.
- **DÉCISION** : garde basée sur User + Partner courant + statut/capability.
- **À VÉRIFIER** : slug Partner stable et endpoints publics actuellement centrés sur UUID.

## 78. Admin link

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : lien « Administration » visible seulement à un User possédant un rôle privilégié, ouvrant l’espace Admin séparé.
- **DÉCISION** : ce lien ne transfère pas la session; l’Admin exige sa propre authentification.
- **RECOMMANDATION SÉCURITÉ** : ne pas révéler les permissions détaillées Admin dans le HTML public.

## 79. Test strategy

- **CIBLE — NON ENCORE IMPLÉMENTÉ** : tests unitaires cookies/redirects/mapping, intégration Route Handlers, contrats backend, composants formulaires, E2E direct et auth-on-action.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : matrices anonyme/User/Partner/Admin, statuts compte/Partner, desktop/mobile et multi-tab.
- **DÉCISION** : utiliser un backend de test réaliste pour rotation et cookies; ne pas valider la sécurité seulement avec mocks.

## 80. Security tests

- Tester vol/absence/falsification cookies, fixation de session, CSRF, open redirect, XSS, cache poisoning, token leakage, brute force et enumeration.
- Tester refresh concurrent/reuse, logout inter-onglets, anciennes réponses, confusion User/Admin et proxy path traversal.
- Tester OAuth `state/nonce/aud/azp/iss`, Turnstile action/hostname, uploads malveillants et replay d’intention.
- **CIBLE — NON ENCORE IMPLÉMENTÉ** : ces tests sont bloquants CI pour les routes Auth/BFF.

## 81. Failure scenarios

| Scénario | Réponse cible |
|---|---|
| Auth backend indisponible | `503`, aucun cookie modifié, message réessayable |
| Access expiré, refresh valide | rotation unique puis replay |
| Refresh invalide/réutilisé | purge User, logout multi-tab, nouvelle auth |
| `/me` interdit | mapper statut, pas de boucle refresh |
| Turnstile indisponible | message explicite, retry contrôlé, fail closed |
| OAuth annulé | retour au contexte sans mutation |
| Intent expirée | login conservé, retour ressource sans replay |
| Partner role/status divergent | lecture limitée, retry borné, support/correlation ID |

## 82. Implementation order

1. Figer contrats, cookies, erreurs et ADR.
2. Créer helpers BFF User et protections CSRF/Origin.
3. Implémenter login/logout/refresh/session et mutex.
4. Implémenter register/verify/recovery/Google OAuth.
5. Ajouter providers, guards et invalidation multi-tab.
6. Ajouter intent store et auth-on-action faible risque.
7. Ajouter Partner guards/status puis actions sensibles.
8. Ajouter sessions, WebSocket/Push, métriques et hardening.

## 83. Prompt 5 scope

- **INCLUS RECOMMANDÉ** : implémentation P0 du BFF User, cookies, CSRF/Origin, login/register/logout/refresh/session, Turnstile, Google OAuth, provider User et guards de base.
- **INCLUS RECOMMANDÉ** : infrastructure d’intention + un parcours auth-on-action faible risque démonstrateur.
- **EXCLU À CE STADE** : paiement, réauth L3 complète, Apple Web, Web Push/WebSocket tickets et gestion avancée de sessions, sauf contrat backend prêt.

## 84. P0 blockers

- Durées et rotation cookies alignées aux configurations backend réelles.
- Hostnames/domaine final, CSP et clés Turnstile/OAuth Web validés.
- Mutex refresh compatible multi-instance pour éviter `REFRESH_TOKEN_REUSE_DETECTED`.
- Contrat session minimal et mapping officiel des erreurs/statuts.
- Protection CSRF/Origin appliquée à toutes les mutations cookie-authenticated.
- Décision username avant toute route `/@/[username]`.
- Isolation effective des providers/caches/cookies User et Admin.

## 85. ADR Auth

| ADR | Décision | Statut |
|---|---|---|
| AUTH-001 | BFF same-origin et cookies `HttpOnly` | CIBLE — NON ENCORE IMPLÉMENTÉ |
| AUTH-002 | Sessions User/Admin isolées | CIBLE — NON ENCORE IMPLÉMENTÉ |
| AUTH-003 | Partner = même User + entité + rôle après approbation | ACCEPTÉ |
| AUTH-004 | Pages publiques sans auth, auth-on-action pour mutations | ACCEPTÉ |
| AUTH-005 | Intentions courtes, signées, usage unique | CIBLE — NON ENCORE IMPLÉMENTÉ |
| AUTH-006 | Pas de cookie résumé User | ACCEPTÉ |
| AUTH-007 | Autorisation finale dans les services | ACCEPTÉ |
| AUTH-008 | Replay auto limité aux actions idempotentes | ACCEPTÉ |

## 86. Final Auth matrix

| Surface/action | Anonyme | User | Partner non approuvé | Partner approuvé | Admin seul |
|---|---:|---:|---:|---:|---:|
| Pages publiques | oui | oui | oui | oui | oui |
| Favori/follow | auth-on-action | oui | oui | oui | auth User requise |
| Commande/réservation | auth-on-action | oui si vérifié | oui si vérifié | oui si vérifié | auth User requise |
| Espace User | non | oui | oui | oui | non |
| Créer dossier Partner | auth-on-action | oui | dossier existant | dossier existant | auth User requise |
| Éditer dossier/KYC | non | si owner | selon statut | non sauf règle | non |
| Dashboard Partner | non | onboarding | statut limité | oui | non |
| Administration | non | rôle privilégié + login Admin | idem | idem | oui |
| Action L3 | non | réauth | réauth | réauth | politique Admin séparée |

## 87. Risks

- **CRITIQUE** : course de refresh provoquant révocation globale des sessions.
- **ÉLEVÉ** : confusion de cookies/providers/cache entre User et Admin.
- **ÉLEVÉ** : CSRF si le passage Bearer -> cookies n’est pas accompagné d’Origin/token CSRF.
- **ÉLEVÉ** : replay d’intention transactionnelle sans idempotence ni revalidation.
- **MOYEN** : dérive rôle Partner/statut Partner par cohérence événementielle.
- **MOYEN** : OAuth merge et username sans contrat backend officiel.
- **MOYEN** : personnalisation SSR contaminant le cache public.

## 88. Conclusion

- L’architecture cible conserve les contrats Auth backend éprouvés par Mobile tout en adaptant leur stockage au Web par un BFF et des cookies `HttpOnly`.
- L’isolation Admin/User est une contrainte structurelle, non une convention d’UI.
- Le modèle Partner réel est **même User + entité Partner + rôle après approbation**, avec autorisation pilotée par le statut.
- L’auth-on-action doit restaurer l’intention sans jamais sacrifier CSRF, idempotence, revalidation métier ou protection contre les redirects ouverts.
- Le Prompt 5 peut implémenter le socle P0 seulement après validation des bloqueurs de la section 84.
