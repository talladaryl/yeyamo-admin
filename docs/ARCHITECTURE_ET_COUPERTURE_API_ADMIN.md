# YeYamo Admin — Architecture, couverture API et interfaces manquantes

## 1. Objet du document

Ce document constitue la référence technique de `yeyamo-admin` après audit du frontend, de `README_API.md`, du Gateway et des microservices backend YeYamo.

Il distingue quatre états qui ne doivent pas être confondus :

1. **Consommée par une interface** : une page ou une action visible appelle réellement l'API.
2. **Client disponible, interface absente** : la fonction TypeScript existe, mais aucun écran ne l'expose.
3. **API backend présente mais non consommée** : le backend expose la route, sans client ni interface complète dans l'admin.
4. **API absente ou inaccessible** : le besoin d'administration ne peut pas être terminé sans évolution backend ou Gateway.

Ce document décrit l'état réel du code. Il ne considère pas une entrée de menu, un mock ou un composant visuel comme une fonctionnalité opérationnelle.

---

## 2. Périmètre audité

### 2.1 Frontend administrateur

- Application `yeyamo-admin`.
- Routes Next.js sous `app/`.
- Composants d'administration sous `components/`.
- Configuration de navigation dans `lib/admin-config.ts`.
- Mapping écrans/API dans `lib/admin-resources.ts`.
- Client HTTP et clients métier dans `lib/api/`.
- Proxy backend et gestion de session dans `app/api/` et `lib/server/`.
- Ancien système de mocks dans `lib/mocks.ts` et `lib/api-client.ts`.

### 2.2 Backend

- `api-gateway` et sa configuration centralisée.
- `auth-service`.
- `admin-service`.
- `analytics-service`.
- `moderation-trust-service`.
- `campaign-service`.
- `catalog-service`.
- `ingestion-service`.
- `mission-reward-service`.
- `commerce-service`.
- `booking-service`.
- `payment-service`.
- `place-service`.
- `event-service`.
- Services adjacents dont les besoins figurent dans la navigation admin.
- Contrats documentés dans `README_API.md`.

---

## 3. Stack technique réelle de `yeyamo-admin`

| Élément | Technologie détectée | Usage actuel |
|---|---|---|
| Framework | Next.js 15.5 | App Router, pages, layouts et Route Handlers |
| UI | React 19 | Composants client et serveur |
| Langage | TypeScript strict | Vérification `strict`, routes typées |
| Graphiques | Recharts | Composants historiques du dashboard mocké |
| Icônes | Lucide React | Sidebar, topbar et composants visuels |
| Animations | Framer Motion | Disponible dans les dépendances |
| Validation | Zod | Installé, mais non encore généralisé aux formulaires admin |
| Data fetching | `fetch` natif | Utilisé par le proxy et le client API |
| React Query | TanStack Query installé | Pas encore initialisé globalement dans l'architecture actuelle |
| Styles | CSS global et CSS par espace | `admin.css`, `login.css`, `globals.css` |
| Carte | Mapbox GL installé | Aucune interface cartographique admin opérationnelle détectée |

### 3.1 Écart entre dépendances et usage

- TanStack Query est installé mais les nouvelles pages utilisent actuellement `useEffect` et le client `fetch`.
- Zod est installé mais les actions reposent encore sur des objets simples et quelques `window.prompt`.
- Les anciens composants Recharts restent présents, mais le dashboard réel affiche le contrat exact retourné par analytics-service.
- `lib/mocks.ts` existe encore pour les anciens composants, mais les nouvelles interfaces connectées ne l'utilisent pas.

---

## 4. Structure applicative

```text
yeyamo-admin/
├── app/
│   ├── (auth)/admin/login/
│   │   ├── page.tsx
│   │   └── login.css
│   ├── (dashboard)/admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── [...slug]/page.tsx
│   │   └── admin.css
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       └── backend/[...path]/route.ts
├── components/
│   ├── admin-login-form.tsx
│   ├── admin-live-dashboard.tsx
│   ├── admin-resource-page.tsx
│   ├── admin-shell.tsx
│   ├── module-page.tsx
│   ├── sidebar.tsx
│   └── topbar.tsx
├── lib/
│   ├── api/
│   │   ├── admin-api.ts
│   │   ├── client.ts
│   │   └── types.ts
│   ├── server/backend.ts
│   ├── admin-config.ts
│   ├── admin-resources.ts
│   ├── api-client.ts
│   ├── mocks.ts
│   └── types.ts
├── middleware.ts
└── .env.example
```

### 4.1 Responsabilités

| Fichier | Responsabilité |
|---|---|
| `app/(auth)/admin/login/page.tsx` | Écran de connexion administrateur |
| `components/admin-login-form.tsx` | Soumission du login et gestion des erreurs |
| `app/api/auth/login/route.ts` | Relais vers auth-service, contrôle des rôles et création des cookies |
| `app/api/auth/logout/route.ts` | Logout backend non bloquant et suppression des cookies |
| `middleware.ts` | Protection des routes `/admin/:path*` |
| `app/api/backend/[...path]/route.ts` | Proxy authentifié vers le Gateway |
| `lib/server/backend.ts` | URL backend, noms de cookies et fonctions de session |
| `lib/api/client.ts` | Client HTTP navigateur et normalisation des erreurs |
| `lib/api/admin-api.ts` | Fonctions API par domaine |
| `lib/admin-config.ts` | Navigation, rôles d'affichage et métadonnées des modules |
| `lib/admin-resources.ts` | Association entre une route admin, un loader et des actions |
| `components/admin-resource-page.tsx` | Tableau générique, états loading/error/empty et actions |
| `components/admin-live-dashboard.tsx` | Chargement du dashboard analytics réel |

---

## 5. Architecture réseau et authentification

### 5.1 Flux de connexion

```text
Navigateur
  -> POST /api/auth/login (Next.js)
  -> POST /api/v1/auth/login (API Gateway :8083)
  -> auth-service
  -> AuthResponse YeYamo
  -> vérification du rôle par yeyamo-admin
  -> cookies HttpOnly access + refresh + informations minimales utilisateur
  -> redirection vers /admin
```

Payload envoyé au backend :

```json
{
  "identifier": "admin@yeyamo.com",
  "password": "********"
}
```

Le backend reste responsable de la validation du mot de passe, du statut utilisateur, du rate limiting et des règles de sécurité.

### 5.2 Rôles acceptés par l'admin web

- `SUPER_ADMIN`
- `ADMIN`
- `MODERATOR`
- `EDITOR`
- `SUPPORT`
- `COMMERCIAL`

Une authentification valide sans l'un de ces rôles retourne `ADMIN_ACCESS_REQUIRED`.

### 5.3 Stockage des tokens

- Access token : cookie `yeyamo_admin_access`, `HttpOnly`, `SameSite=Lax`.
- Refresh token : cookie `yeyamo_admin_refresh`, `HttpOnly`, `SameSite=Strict`, limité au chemin `/api`.
- Résumé utilisateur : cookie `yeyamo_admin_user`, `HttpOnly`.
- Aucun JWT n'est stocké dans `localStorage` ou exposé aux composants React.
- En production, les cookies utilisent l'attribut `Secure`.

### 5.4 Proxy backend

Les composants navigateur n'appellent pas directement `http://localhost:8083`. Ils appellent :

```text
/api/backend/api/v1/...
```

Le Route Handler Next.js :

1. vérifie la présence du cookie d'accès ;
2. vérifie que le chemin appartient à la liste blanche ;
3. ajoute `Authorization: Bearer <token>` ;
4. transmet la query string, la méthode et le body ;
5. transmet `Idempotency-Key` lorsqu'il est fourni ;
6. retourne le statut et le body backend sans le remplacer par un mock.

### 5.5 Préfixes autorisés dans le proxy

- `/api/v1/admin/**`
- `/api/v1/analytics/**`
- `/api/v1/moderation/**`
- `/api/v1/trust/**`
- `/api/v1/catalog/**`
- `/api/v1/mission-management/**`
- `/api/v1/missions/**`
- `/api/v1/commerce/**`
- `/api/v1/payments/**`
- `/api/v1/bookings/**`
- `/api/v1/booking-management/**`
- `/api/v1/events/**`
- `/api/v1/places/**`
- `/api/v1/regions/**`
- `/api/v1/cities/**`
- `/api/v1/districts/**`
- `/api/v1/categories/**`

### 5.6 Limites actuelles de session

- Le refresh token est stocké, mais le proxy ne rejoue pas encore automatiquement `/api/v1/auth/refresh` après un `401`.
- L'identité réelle n'est pas encore affichée dans la topbar.
- La navigation masque les modules selon un rôle statique défini dans `admin-config.ts`, pas encore selon les rôles de la session.
- Les scopes fins, notamment `SCOPE_campaign:approve`, ne sont pas interprétés côté interface.
- Le login adaptatif Turnstile n'est pas géré si auth-service retourne `TURNSTILE_REQUIRED`.

---

## 6. Gestion des erreurs et des données

### 6.1 Erreurs

`lib/api/client.ts` transforme les erreurs backend en `ApiError` contenant :

- statut HTTP ;
- code d'erreur ;
- message ;
- correlationId éventuel.

Les écrans affichent l'erreur au lieu de retourner des données factices.

### 6.2 États UI gérés

- chargement ;
- succès avec données ;
- résultat vide ;
- erreur backend ;
- action en cours ;
- rafraîchissement après mutation.

### 6.3 Typage

Une partie importante des réponses est actuellement typée `ApiRecord`, soit `Record<string, unknown>`.

Cette stratégie permet de consommer rapidement des contrats backend hétérogènes, mais elle n'est pas suffisante pour une administration finalisée. Chaque domaine devra recevoir :

- un type de réponse exact ;
- un type de requête exact ;
- une validation Zod ;
- un mapper d'affichage ;
- des colonnes explicites ;
- des formulaires métier dédiés.

---

## 7. Matrice exhaustive des API déjà déclarées dans le client admin

### 7.1 Authentification

| Méthode | Endpoint | État | Interface |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Consommé via Route Handler | Formulaire login |
| POST | `/api/v1/auth/logout` | Consommé via Route Handler | Bouton déconnexion |
| POST | `/api/v1/auth/refresh` | Backend présent, non consommé automatiquement | Absente |

### 7.2 Comptes administrateurs — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/users` | Oui | Liste connectée |
| GET | `/api/v1/admin/users/{id}` | Oui | Détail absent |
| POST | `/api/v1/admin/users` | Oui | Formulaire création absent |
| PUT | `/api/v1/admin/users/{id}` | Oui | Formulaire modification absent |

Important : ces endpoints gèrent les lignes `admin_users`, pas la population générale de YeYamo.

### 7.3 Audit administratif — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/audit-logs` | Oui | Liste connectée sous Paramètres |

Manques : pagination, filtre par acteur/action/cible/date/correlationId et export.

### 7.4 Signalements historiques — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/reports?status=` | Oui | Liste connectée |
| POST | `/api/v1/admin/reports` | Non nécessaire à l'admin actuel | Création publique absente |
| PATCH | `/api/v1/admin/reports/{id}/resolution` | Oui | Action Résoudre |

### 7.5 Validations partenaires — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/validations/partners?status=` | Oui | Liste connectée |
| POST | `/api/v1/admin/validations/partners` | Backend présent, client de création absent | Interface absente |
| PATCH | `/api/v1/admin/validations/partners/{id}/review` | Oui | Approuver/Rejeter |

### 7.6 Validations lieux — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/validations/places?status=` | Oui | Liste connectée |
| POST | `/api/v1/admin/validations/places` | Backend présent, client de création absent | Interface absente |
| PATCH | `/api/v1/admin/validations/places/{id}/review` | Oui | Approuver/Corrections |

### 7.7 Actions de modération historiques — admin-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/admin/moderation-actions?targetType=&targetId=` | Oui | Recherche par cible absente |
| POST | `/api/v1/admin/moderation-actions` | Oui | Formulaire d'action absent |

### 7.8 File de modération — moderation-trust-service

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/moderation/reports?status=&limit=` | Oui | Liste connectée |
| GET | `/api/v1/moderation/reports/{id}` | Oui | Détail dédié absent |
| POST | `/api/v1/moderation/reports/{id}/review` | Oui | Action Prendre en revue |
| POST | `/api/v1/moderation/reports/{id}/decision` | Oui | Actions Approuver/Rejeter |
| GET | `/api/v1/moderation/audit?limit=` | Oui | Interface absente |
| GET | `/api/v1/trust/{subjectId}` | Oui | Recherche et fiche trust absentes |

### 7.9 Analytics

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/analytics/admin/dashboard` | Oui | Dashboard connecté |
| GET | `/api/v1/analytics/kpis` | Oui | Liste connectée |
| GET | `/api/v1/analytics/event-logs` | Oui | Interface absente |
| POST | `/api/v1/analytics/business/admin/rebuild` | Oui dans le client | Bouton absent, route exacte à revalider |
| GET | `/api/v1/analytics/kpis/{kpiName}` | Backend présent | Client et courbe de détail absents |
| GET | `/api/v1/analytics/regions/{regionId}/activity` | Backend présent | Interface absente |
| GET | `/api/v1/analytics/partners/{partnerId}/dashboard` | Backend présent | Interface absente |
| GET | `/api/v1/analytics/places/popular` | Backend présent | Interface réelle absente |
| GET | `/api/v1/analytics/places/{placeId}/popularity` | Backend présent | Interface absente |
| GET | `/api/v1/analytics/users/{userId}/engagement` | Backend présent | Interface absente |

### 7.10 Catalogue

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/catalog/assets?limit=` | Oui | Liste Catalogue et Culture |
| PATCH | `/api/v1/catalog/assets/{id}/status` | Oui | Action de statut absente |
| DELETE | `/api/v1/catalog/assets/{id}` | Oui | Action sécurisée absente |
| GET | `/api/v1/catalog/assets/{id}` | Backend présent | Détail absent |
| GET | `/api/v1/catalog/assets/manage/{id}` | Backend présent | Détail management absent |
| POST | `/api/v1/catalog/assets` | Backend présent | Formulaire absent |
| PUT | `/api/v1/catalog/assets/{id}` | Backend présent | Formulaire absent |
| CRUD | `/api/v1/catalog/{regions|cities|categories}` | Backend présent | Interfaces absentes |
| CRUD | `/api/v1/collections` | Backend présent | Interface absente |

### 7.11 Ingestion catalogue

| Méthode | Endpoint | État | Interface |
|---|---|---|---|
| POST | `/api/v1/catalog/imports` | Backend présent, non consommé | Soumission import absente |
| GET | `/api/v1/catalog/imports/{id}` | Backend présent, non consommé | Suivi de job absent |

Il manque aussi un endpoint de liste globale des imports, indispensable pour une console d'exploitation.

### 7.12 Missions et gamification

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/missions` | Oui | Liste connectée |
| POST | `/api/v1/mission-management/missions` | Backend présent | Formulaire création absent |
| POST | `/api/v1/mission-management/missions/{id}/activate` | Oui | Action Activer |
| POST | `/api/v1/mission-management/missions/{id}/pause` | Oui | Action Pause |

Il n'existe pas d'interface admin complète pour les règles XP, badges, récompenses, pools et contrôles antifraude annoncés dans le menu.

### 7.13 Campagnes publicitaires

| Méthode | Endpoint | Client | Interface | Accessibilité Gateway |
|---|---|---|---|---|
| GET | `/api/v1/admin/campaigns` | Oui | Liste prévue | Bloquée par conflit de routage |
| GET | `/api/v1/admin/campaigns/{id}` | Backend présent | Détail absent | Bloquée par conflit de routage |
| POST | `/api/v1/admin/campaigns/{id}/approve` | Oui | Action prévue | Bloquée par conflit de routage |
| POST | `/api/v1/admin/campaigns/{id}/reject` | Oui | Action prévue | Bloquée par conflit de routage |

#### Conflit critique

Le Gateway route `/api/v1/admin/**` vers `admin-service`. Les contrôleurs de campagne sont dans `campaign-service` avec le même préfixe `/api/v1/admin/campaigns`.

Conséquence : le Gateway envoie les appels campagne vers `admin-service`, qui ne possède pas ces contrôleurs. L'interface ne peut donc pas fonctionner via le Gateway tant qu'une route spécifique, prioritaire et placée avant la route générique admin n'est pas créée.

Deuxième risque : `campaign-service` exige des authorities `SCOPE_campaign:approve` et `SCOPE_campaign:reject`. Il faut vérifier que les JWT YeYamo contiennent réellement ces scopes.

### 7.14 Commerce, promotions et ledger

| Méthode | Endpoint | Client | Interface |
|---|---|---|---|
| GET | `/api/v1/commerce/admin/promotions` | Oui | Absente |
| GET | `/api/v1/commerce/admin/promotions/{id}` | Backend présent | Absente |
| POST | `/api/v1/commerce/admin/promotions` | Backend présent | Formulaire absent |
| PUT | `/api/v1/commerce/admin/promotions/{id}` | Backend présent | Formulaire absent |
| POST | `/api/v1/commerce/admin/promotions/{id}/disable` | Oui | Action absente |
| POST | `/api/v1/commerce/admin/commissions` | Backend présent | Formulaire absent |
| GET | `/api/v1/commerce/admin/ledger/{partnerId}` | Oui | Interface absente |
| GET | `/api/v1/commerce/admin/ledger/{partnerId}/balance/{currency}` | Backend présent | Interface absente |
| POST | `/api/v1/commerce/admin/ledger/{partnerId}/adjustments` | Backend présent | Interface absente |
| POST | `/api/v1/commerce/admin/ledger/{partnerId}/movements` | Backend présent | Interface absente |

### 7.15 Réservations

| Méthode | Endpoint | État admin |
|---|---|---|
| GET | `/api/v1/bookings/{id}` | Un admin peut consulter un booking connu |
| GET | `/api/v1/bookings/{id}/history` | Historique accessible si ID connu |
| POST | `/api/v1/bookings/{id}/cancel` | Annulation possible selon autorisation |
| POST | `/api/v1/booking-management/slots` | Création de slot disponible |
| POST | `/api/v1/booking-management/slots/{id}/close` | Fermeture de slot disponible |
| POST | `/api/v1/booking-management/bookings/{id}/complete` | Complétion disponible |

API bloquante absente : `GET /api/v1/booking-management/bookings` ou équivalent pour lister, filtrer et rechercher toutes les réservations.

### 7.16 Paiements et remboursements

| Méthode | Endpoint | État admin |
|---|---|---|
| GET | `/api/v1/payments/{id}` | Consultation possible si ID connu et autorisation compatible |
| GET | `/api/v1/payments/{id}/refunds` | Historique si paiement connu |
| POST | `/api/v1/payments/{id}/refunds` | Remboursement admin disponible avec `Idempotency-Key` |

API bloquante absente : liste globale des paiements, recherche, filtres, rapprochement, anomalies et vue financière consolidée.

### 7.17 Lieux, régions, villes et districts

Les services exposent des lectures publiques et plusieurs écritures administratives : création et modification de lieux, régions, villes et districts.

État dans `yeyamo-admin` :

- la page Lieux affiche actuellement les validations de `admin-service` ;
- elle n'affiche pas le catalogue complet de `place-service` ;
- aucun formulaire métier lieu/région/ville/district n'est présent ;
- aucun éditeur de coordonnées ou carte de revue n'est présent ;
- aucune gestion des catégories de lieux n'est présente.

### 7.18 Événements

Le backend permet création, lecture, modification, changement de statut, inscription et désinscription.

Limite : les routes sont principalement orientées public ou créateur. Il manque une route admin globale paginée permettant :

- filtrage par statut, date, région, organisateur et lieu ;
- détection des événements expirés ou incomplets ;
- modération et publication administrative ;
- export ;
- consultation des participants avec garanties d'autorisation.

---

## 8. Couverture réelle par route de navigation

| Route frontend | Libellé | Source réelle | Actions réelles | Statut |
|---|---|---|---|---|
| `/admin` | Dashboard | Analytics dashboard | Aucune | Connecté |
| `/admin/users` | Utilisateurs | Admin users | Aucune visible | Partiel, ne couvre pas les utilisateurs plateforme |
| `/admin/places` | Lieux | Validations lieux | Approuver, Corrections | Partiel |
| `/admin/events` | Événements | Aucune | Aucune | Interface absente |
| `/admin/reservations` | Réservations | Aucune liste backend | Aucune | Bloqué par API absente |
| `/admin/reviews` | Avis & Commentaires | Reports admin | Résoudre | Partiel, pas de CRUD avis/commentaires |
| `/admin/partners` | Partenaires | Validations partenaires | Approuver, Rejeter | Partiel |
| `/admin/catalog` | Catalogue | Catalog assets | Aucune visible | Lecture partielle |
| `/admin/culture` | Culture | Catalog assets | Aucune visible | Lecture partielle non filtrée |
| `/admin/places-events` | Lieux & Events | Validations lieux | Aucune | Partiel |
| `/admin/moderation` | Modération / Signalements | Moderation queue | Revue, Approuver, Rejeter | Connecté mais générique |
| `/admin/trust` | Trust & Safety | Aucune interface | Aucune | Client trust disponible, écran absent |
| `/admin/gamification` | Gamification | Missions | Activer, Pause | Partiel |
| `/admin/campaigns` | Campagnes | Admin campaigns | Approuver, Rejeter | Bloqué par Gateway/scopes |
| `/admin/messages` | Messages | Aucune API admin dédiée | Aucune | Absent |
| `/admin/newsletter` | Newsletter | Aucune API dédiée | Aucune | Absent |
| `/admin/search-discovery` | Search & Discovery | Aucune API admin dédiée | Aucune | Absent |
| `/admin/analytics` | Analytique | KPI | Aucune | Lecture partielle |
| `/admin/settings` | Paramètres | Admin audit logs | Aucune | Audit connecté, paramètres absents |

---

## 9. API backend absentes à créer

### 9.1 Priorité P0 — exploitation indispensable

#### Utilisateurs plateforme

- `GET /api/v1/admin/platform-users`
- `GET /api/v1/admin/platform-users/{id}`
- `PATCH /api/v1/admin/platform-users/{id}/status`
- `PATCH /api/v1/admin/platform-users/{id}/roles`
- `GET /api/v1/admin/platform-users/{id}/sessions`
- `POST /api/v1/admin/platform-users/{id}/sessions/revoke`
- `GET /api/v1/admin/platform-users/export`

Filtres minimum : texte, email, téléphone, statut, rôle, région, date de création, dernière connexion et pagination.

#### Réservations

- `GET /api/v1/booking-management/bookings`
- `GET /api/v1/booking-management/bookings/{id}` avec vue enrichie
- filtres par statut, partenaire, utilisateur, activité, date et paiement ;
- agrégats de volumes et montants ;
- gestion de litige et notes support.

#### Paiements

- `GET /api/v1/payments/admin`
- `GET /api/v1/payments/admin/{id}`
- recherche par booking, utilisateur, providerPaymentId et idempotency key ;
- filtres par statut, provider, devise, période ;
- endpoint de rapprochement et d'anomalies.

#### Correction Gateway campagnes

- route Gateway spécifique `/api/v1/admin/campaigns/**` vers `campaign-service` ;
- priorité supérieure à `/api/v1/admin/**` ;
- validation de la présence des scopes campagne dans les JWT.

### 9.2 Priorité P1 — modération et contenu

#### Avis et commentaires

- liste globale paginée ;
- détail et contexte ;
- masquage, restauration et suppression logique ;
- verrouillage des réponses ;
- historique d'actions ;
- filtres par score, signalement, auteur, lieu et date.

#### Événements

- liste admin globale ;
- détail admin enrichi ;
- publication, suspension, rejet et archivage ;
- filtres administratifs et export.

#### Catalogue et imports

- liste globale des jobs d'import ;
- annulation/rejeu d'un job ;
- rapport d'erreurs ligne par ligne ;
- validation avant publication ;
- détection de doublons.

### 9.3 Priorité P2 — support, croissance et gouvernance

#### Messagerie support

- inbox admin ;
- assignation à un agent ;
- statut ouvert/en attente/résolu ;
- SLA ;
- notes internes ;
- macros de réponse ;
- recherche et pièces jointes.

#### Newsletter

- CRUD campagnes email ;
- audiences et segments ;
- preview ;
- planification ;
- pause/annulation ;
- métriques de délivrabilité, ouverture et clic.

#### Search & Discovery

- état OpenSearch ;
- statistiques d'index ;
- reindexation ;
- gestion des synonymes ;
- ranking policies ;
- feature flags ;
- reason codes ;
- métriques zero-result.

#### Configuration plateforme

- paramètres versionnés ;
- feature flags ;
- maintenance mode ;
- limites fonctionnelles ;
- gestion centralisée des permissions ;
- historique et rollback.

#### Notifications administratives

- alertes critiques ;
- compteur non lu ;
- marquage lu/non lu ;
- préférences ;
- deep links vers les dossiers concernés.

---

## 10. Interfaces frontend absentes à développer

### 10.1 Composants transverses

- DataTable métier avec colonnes explicites.
- Pagination serveur.
- Tri serveur.
- Filtres persistants dans l'URL.
- Recherche avec debounce.
- Drawer ou page de détail.
- Formulaires Zod avec messages par champ.
- Dialogues de confirmation pour actions irréversibles.
- Affichage du correlationId sur erreur supportable.
- Toasts succès/erreur.
- Export CSV/XLSX lorsque supporté.
- Sélecteur de période réel.
- Contrôle RBAC par rôle et scope.
- Skeletons cohérents.
- Empty states spécifiques.

### 10.2 Utilisateurs

- liste des utilisateurs plateforme ;
- fiche utilisateur ;
- sessions ;
- historique d'activité ;
- suspension/réactivation ;
- modification de rôles ;
- révocation des sessions ;
- export et anonymisation selon politique.

### 10.3 Administrateurs

- création d'un admin ;
- modification rôle/statut/permissions ;
- désactivation ;
- détail des permissions effectives ;
- historique d'audit par administrateur.

### 10.4 Partenaires

- détail KYC avec prévisualisation sécurisée des documents ;
- formulaire de commentaire ;
- risk score contrôlé ;
- historique des décisions ;
- fiche partenaire enrichie ;
- établissements associés ;
- finance, commissions et ledger.

### 10.5 Lieux et catalogue

- liste globale ;
- filtres géographiques ;
- formulaire création/édition ;
- carte de revue ;
- correction latitude/longitude ;
- workflow de statut ;
- références région/ville/catégorie ;
- import et suivi de job ;
- collections éditoriales.

### 10.6 Événements

- calendrier ;
- liste et filtres ;
- détail ;
- création/édition ;
- publication et suspension ;
- participants ;
- billetterie et indicateurs.

### 10.7 Réservations et paiements

- liste réservations ;
- détail et timeline ;
- historique de statut ;
- annulation/complétion ;
- détail paiement ;
- remboursement avec montant et idempotency key ;
- rapprochement et anomalies.

### 10.8 Modération et Trust & Safety

- détail complet du signalement ;
- aperçu du contenu signalé ;
- identité de la cible ;
- assignation ;
- décision structurée ;
- sanctions ;
- recherche trust score ;
- historique des actions ;
- audit modération.

### 10.9 Gamification

- création de mission ;
- édition ;
- règles et critères ;
- rewards ;
- badges ;
- XP rules ;
- contrôles antifraude ;
- statistiques de complétion.

### 10.10 Campagnes et commerce

- liste paginée des campagnes ;
- détail campagne ;
- contenu, ciblage et budget ;
- approbation/rejet avec motif ;
- promotions CRUD ;
- commissions ;
- ledger ;
- balances ;
- ajustements avec confirmation renforcée.

### 10.11 Analytics

- cartes KPI typées ;
- courbes historiques ;
- sélecteur de période ;
- analytics région ;
- analytics partenaire ;
- popularité lieux ;
- engagement utilisateur ;
- logs d'événements ;
- reconstruction des projections avec confirmation et suivi.

### 10.12 Paramètres

- identité administrateur connectée ;
- rôles et permissions ;
- feature flags ;
- paramètres plateforme ;
- sécurité ;
- audit filtrable ;
- gestion des sessions admin.

---

## 11. Risques techniques et de sécurité

### 11.1 Risques critiques

1. Conflit de routage Gateway pour les campagnes.
2. Absence de refresh automatique : expiration de session pendant une opération.
3. RBAC frontend statique : menu potentiellement incohérent avec les droits réels.
4. Scopes campagne potentiellement absents des JWT.
5. DTO de review backend acceptant certains identifiants d'acteur dans le body ; l'acteur devrait venir exclusivement du JWT.

### 11.2 Risques fonctionnels

1. `/admin/users` peut être interprété à tort comme la gestion de tous les utilisateurs alors qu'il ne gère que les admins.
2. Les tableaux génériques affichent les clés backend sans vocabulaire métier ni formatage dédié.
3. Les actions utilisent encore `window.prompt`, insuffisant pour validation, accessibilité et traçabilité.
4. Les pages Catalogue et Culture consomment la même liste non filtrée.
5. Les modules sans API affichent une information d'indisponibilité mais ne sont pas masqués.

### 11.3 Risques de maintenance

1. Types `ApiRecord` trop permissifs.
2. Ancien `lib/api-client.ts` avec fallback mocks toujours présent, créant deux conventions API concurrentes.
3. Anciens composants dashboard mockés toujours présents.
4. React Query installé mais non standardisé.
5. Absence de tests automatisés frontend pour auth, proxy, tableaux et actions.

---

## 12. Variables d'environnement

```env
API_BASE_URL=http://localhost:8083
NEXT_PUBLIC_API_BASE_URL=http://localhost:8083
```

Recommandation : utiliser principalement `API_BASE_URL`, car les appels passent par les Route Handlers serveur. `NEXT_PUBLIC_API_BASE_URL` ne doit être conservée que pour compatibilité transitoire.

Aucun JWT, mot de passe, secret OAuth, clé SMTP ou secret backend ne doit être placé dans une variable `NEXT_PUBLIC_*`.

---

## 13. Validation technique réalisée

- TypeScript strict : `npx.cmd tsc --noEmit --incremental false` réussi.
- Build production : `npm.cmd run build` réussi.
- Routes générées : login, dashboard, modules dynamiques, proxy auth et proxy backend.
- Recherche de secrets dans les sources admin : aucun secret détecté.
- Aucun changement backend n'a été nécessaire pour construire le client actuel.

---

## 14. Ordre recommandé des prochains travaux

### Phase 1 — sécuriser le socle

1. Corriger la route Gateway des campagnes.
2. Ajouter le refresh automatique et le traitement uniforme des `401`.
3. Charger l'utilisateur connecté et ses permissions réelles.
4. Remplacer le rôle statique de navigation par le RBAC de session.
5. Ajouter les tests des Route Handlers et du middleware.

### Phase 2 — opérations critiques

1. Créer les APIs de liste admin utilisateurs, réservations et paiements.
2. Construire les interfaces Utilisateurs, Réservations et Paiements.
3. Finaliser les détails KYC et modération.
4. Ajouter pagination, filtres, recherche et pages de détail.

### Phase 3 — contenu et croissance

1. Finaliser Catalogue, lieux et événements.
2. Ajouter imports et collections.
3. Construire promotions, commissions et ledger.
4. Rendre les campagnes réellement accessibles après correction Gateway.
5. Compléter les analytics métier.

### Phase 4 — support et gouvernance

1. Ajouter messagerie support.
2. Ajouter newsletter.
3. Ajouter administration Search & Discovery.
4. Ajouter configuration plateforme et feature flags.
5. Ajouter centre de notifications administratives.

---

## 15. Verdict global

### Opérationnel

- authentification admin ;
- protection des routes ;
- proxy JWT ;
- dashboard analytics brut ;
- listes admin, validations, reports, modération, catalogue, missions, KPI et audit ;
- quelques actions de décision.

### Partiellement opérationnel

- utilisateurs, car seuls les comptes administrateurs sont exposés ;
- partenaires et lieux, car seule la validation est couverte ;
- catalogue et culture, car seule la lecture générique est exposée ;
- gamification, car seules les missions sont couvertes ;
- analytics, car seules les vues principales sont branchées.

### Non opérationnel

- campagnes via Gateway ;
- réservations globales ;
- paiements globaux ;
- événements admin ;
- avis/commentaires admin ;
- Trust & Safety complet ;
- messages support ;
- newsletter ;
- Search & Discovery ;
- paramètres plateforme.

`yeyamo-admin` dispose désormais d'un socle technique connecté et sécurisé, mais ne constitue pas encore une console d'administration fonctionnellement complète. Les blocages principaux sont l'absence d'APIs admin globales dans plusieurs domaines, le conflit Gateway des campagnes et l'absence d'interfaces métier spécialisées.
