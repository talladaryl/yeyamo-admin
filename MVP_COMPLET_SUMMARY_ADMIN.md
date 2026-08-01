# YeYamo Admin — état MVP et préparation production

**Audit effectué le 1er août 2026 — cible stores et production : 25 août 2026.**

## Verdict

**Statut global : NO-GO production.** Le socle admin est riche et la Gateway répond, mais plusieurs parcours critiques ne sont pas encore validés de bout en bout. Le ticketing ne démarre pas sans clés QR, Ads doit être reconstruit, les fournisseurs paiement/email réels restent à valider et plusieurs écrans admin utilisent encore des contrats partiels ou des états explicites d’API non exposée.

Le problème « tous les services sont indisponibles » ne provenait pas d’un unique défaut frontend. Il combinait des services arrêtés, des erreurs de sécurité Spring, un conflit de port Support/Campaign, une configuration Config Server manquante pour Ads et les fallbacks `503` de la Gateway.

## Architecture réellement utilisée

- Le navigateur appelle exclusivement les routes Next.js `/api/backend/api/v1/...`.
- Le proxy `app/api/backend/[...path]/route.ts` lit les JWT dans des cookies HttpOnly, ajoute `Authorization` côté serveur et propage `X-Correlation-Id`.
- La Gateway est configurée par Config Server et distribue les requêtes aux microservices via Eureka.
- La session admin provient de `/api/auth/session`; les rôles, permissions et scopes sont désormais conservés dans la session frontend.
- TanStack Query porte les lectures/mutations des features récentes. Des couches génériques historiques `ApiRecord` subsistent et doivent être retirées seulement après vérification de leurs derniers consommateurs.

## Disponibilité constatée

### Répondent en HTTP

- Gateway `8083`: HTTP 200.
- Eureka `8761`: HTTP 200.
- De nombreux services sur `8084`, `8085`, `8088` à `8105`, `8110`, `8113` et Support `8114`: HTTP 200 sur leur health endpoint.
- Commerce a été corrigé et répond.
- Support répond sur `8114`; le conflit avec Campaign `8110` est supprimé.

### Bloqués ou à confirmer

- **Auth**: le conteneur est déclaré sain via readiness, mais le health global direct a déjà retourné 503. Le login réel doit être retesté avec un compte bootstrap connu.
- **Ticket service**: bloqué tant que `TICKET_QR_KEY_ID`, `TICKET_QR_PRIVATE_KEY_BASE64` et `TICKET_QR_PUBLIC_KEY_BASE64` ne sont pas fournis. Aucun secret factice n’a été généré.
- **Ads delivery**: le code compile après ajout de la connexion Redis, mais l’image Docker corrigée n’a pas été reconstruite à cause d’un timeout TLS Docker Hub. Rebuild requis.
- **Payment/email**: disponibilité technique ne signifie pas fournisseur réel validé. Un test sandbox puis production est obligatoire.

## Corrections d’infrastructure réalisées

- Ajout d’un `JwtDecoder` et d’un mapping rôles/scopes/permissions dans Commerce et Ticket.
- Normalisation du port Support sur `8114` dans Compose, Dockerfile et Config Server.
- Ajout des credentials Config Server au service Ads.
- Ajout explicite de la connexion Redis Ads.
- Propagation des permissions/scopes Auth vers la session admin.
- Proxy admin renforcé: allowlist complétée, correlation ID, erreur réseau typée `BACKEND_UNAVAILABLE`.
- Topbar branchée sur l’identité et les notifications réelles; identité fictive supprimée.
- Contrat paiement admin corrigé vers `/api/v1/payments/admin/{id}`.
- Remboursement avec `Idempotency-Key`, montant et motif.
- Rebuild analytics corrigé vers `/api/v1/analytics/business/admin/rebuild`.

## Couverture fonctionnelle admin

| Domaine | Interface | API/backend | État vérifié |
|---|---|---|---|
| Auth/session/RBAC | Présente | Auth + Admin | **PARTIAL** — compilation OK, login/refresh E2E non rejoués |
| Dashboard analytics | Présente | Analytics | **PARTIAL** — endpoint présent, données/agrégations à tester |
| Utilisateurs plateforme | Liste/détail/actions | Admin/User/Auth | **PARTIAL** — endpoint présent dans la cible, E2E non validé |
| Administrateurs | CRUD | Admin service | **PARTIAL** — distinguer définitivement `admin_users` des utilisateurs plateforme |
| Partenaires/KYC | Liste, détail, validation | Partner/Admin | **PARTIAL** — documents signés et événements à tester |
| Lieux/géographie | Places et référentiels | Place | **PARTIAL** — cohérence région/ville et CRUD à tester |
| Catalogue/culture | Assets | Catalog | **PARTIAL** — anciens paramètres `limit/q/code` à réaligner sur le contrat paginé final |
| Collections/imports | Interfaces présentes | Catalog/Ingestion | **PARTIAL** — cycle retry/cancel/errors non testé |
| Événements | Liste/détail/calendrier | Event | **PARTIAL** — routes admin à tester |
| Ticketing/check-in | Interfaces préparées | Ticket | **BLOCKED** — service sans clés QR |
| Réservations | Liste/détail/actions | Booking | **PARTIAL** — un 403 a été observé; authorities à tester avec JWT admin réel |
| Paiements/refunds | Liste/détail/refund | Payment | **PARTIAL** — contrat corrigé, fournisseur/idempotence E2E à tester |
| Promotions/commissions/ledger | Interfaces présentes | Commerce | **PARTIAL** — service disponible, mutations financières non testées E2E |
| Modération/trust | Interfaces présentes | Moderation Trust | **PARTIAL** — décisions/sanctions/audit à tester |
| Reviews/comments | Interface explicite | Interaction | **BLOCKED** — API admin globale hide/restore/delete non confirmée |
| Gamification | Missions présentes | Mission Reward | **PARTIAL** — badges/rewards utilisent encore des endpoints utilisateur; APIs admin existent et doivent être branchées |
| Campaigns | Liste/détail/actions | Campaign | **PARTIAL** — route Gateway prioritaire à valider avec scopes réels |
| Support | Support desk | Support `8114` | **PARTIAL** — service disponible, isolation notes internes à tester |
| Newsletter | Interface présente | Notification | **PARTIAL** — envoi réel, opt-out et statistiques provider à tester |
| Search & Discovery | Structure présente | Discovery/Search | **PARTIAL** — endpoints admin à confronter écran par écran |
| Settings/feature flags | Structure partielle | Admin/config | **PARTIAL** — versioning/rollback non testés |
| Notifications admin | Bell/centre | Notification | **PARTIAL** — anciens 404; retest requis depuis remise en route |
| Audit logs | Interface présente | Admin/Audit | **PARTIAL** — événements cross-service et sanitation à tester |

## Contrats API consommés importants

- Auth: `/api/v1/auth/login`, refresh/logout via routes serveur Next, session via `/api/auth/session`.
- Utilisateurs: `/api/v1/admin/platform-users`, détail, status, roles, sessions et export.
- Administrateurs: `/api/v1/admin/users` et `/api/v1/admin/users/{id}`.
- Partenaires: `/api/v1/admin/partners`, KYC, history, establishments et `/api/v1/admin/validations/partners`.
- Places: `/api/v1/admin/places`, validations, `/api/v1/regions`, cities, districts et categories.
- Catalogue: `/api/v1/catalog/assets`, `/api/v1/collections`, `/api/v1/catalog/imports`.
- Events: `/api/v1/admin/events`; ticketing admin dépend de Ticket service.
- Booking: `/api/v1/booking-management/bookings`.
- Payment: `/api/v1/payments/admin`, `/api/v1/payments/{id}/refunds`.
- Commerce: `/api/v1/commerce/admin/promotions`, commissions et ledger.
- Moderation: `/api/v1/moderation/reports`, audit et `/api/v1/trust`.
- Gamification admin: `/api/v1/mission-management/*`.
- Campaign: `/api/v1/admin/campaigns` avec scopes `campaign:approve` et `campaign:reject`.
- Analytics: `/api/v1/analytics/*`, rebuild `/api/v1/analytics/business/admin/rebuild`.
- Support: `/api/v1/admin/support/conversations`.
- Newsletter: `/api/v1/admin/newsletters`.
- Search admin: `/api/v1/admin/search/*`.
- Notifications: `/api/v1/admin/notifications`.

## Cohésion avec yeyamo-mobile

| Action admin | Effet attendu mobile | État |
|---|---|---|
| Suspendre/bloquer un utilisateur | Rejet auth/refresh et révocation sessions | À tester E2E |
| Approuver/rejeter KYC partenaire | Mise à jour du statut partenaire et accès dashboard mobile | À tester avec Kafka/refresh |
| Valider un lieu | Visibilité Discovery/Place/Search mobile | À tester, notamment indexation |
| Publier/suspendre un événement | Catalogue, feed et réservation mobile | À tester |
| Rembourser/annuler | Statuts paiement/réservation/ticket mobile cohérents | Critique, non validé E2E |
| Décision de modération | Contenu masqué dans feed/search mobile | À tester avec consumers Kafka |
| Approuver une campagne | Campagne partenaire puis diffusion Ads | Bloqué tant qu’Ads corrigé n’est pas redéployé |
| Notification admin | Centre admin uniquement | Séparée des push utilisateurs, comportement normal |

Les liaisons doivent être validées par scénarios et non uniquement par compilation. Aucun effet mobile n’est déclaré fonctionnel sans test API + persistance + événement + lecture mobile.

## Causes des 404/403/500/503 observés

- `503`: service absent/non enregistré, circuit breaker Gateway ouvert ou dépendance du service indisponible.
- `404`: endpoint frontend non exposé, route Gateway absente ou version de service non reconstruite.
- `403`: JWT présent mais rôle/scope/permission non converti ou insuffisant.
- `500`: migration, contrat de requête, dépendance Redis/DB ou exception métier côté service.

Le frontend ne doit pas masquer ces erreurs par des mocks. Il affiche le code backend et le `correlationId` lorsque disponible.

## Urgences avant le 25 août

### 1–5 août — stabilisation obligatoire

1. Générer et injecter les clés QR Ticket via secret manager, puis démarrer Ticket.
2. Rebuilder/redéployer Ads et confirmer son health.
3. Créer/valider un compte `SUPER_ADMIN` bootstrap hors Git.
4. Rejouer login, session, expiration access token, refresh et logout.
5. Exécuter un smoke test authentifié de chaque route Gateway critique.

### 6–10 août — contrats et parcours critiques

1. Brancher Gamification sur les endpoints `/mission-management`.
2. Corriger les derniers paramètres Catalogue et paginations selon DTO Spring réels.
3. Confirmer ou implémenter les APIs admin Reviews/Comments.
4. Tester Users, KYC, Event, Booking, Payment, Moderation, Campaign de bout en bout.
5. Vérifier événements Kafka, idempotence et audit pour chaque mutation critique.

### 11–15 août — fournisseurs externes

1. Paiement sandbox: succès, échec, callback, double callback, remboursement partiel/total.
2. SMTP réel: OTP, forgot/reset password, invitation admin et newsletter opt-out.
3. Push Expo: tickets, receipts et invalidation token.
4. Stockage R2: upload, signed URL, contrôle accès KYC.

### 16–20 août — recette et sécurité

1. Tests Android/iOS réels et dashboard admin sur staging.
2. Tests RBAC par rôle et scopes Campaign.
3. Rotation de toutes les clés déjà partagées dans des échanges ou fichiers historiques.
4. Scan secrets, dépendances et configuration production.
5. Charge minimale sur users/bookings/payments/analytics/moderation.

### 21–24 août — release candidate

1. Gel fonctionnel.
2. Migration staging puis répétition restauration/rollback.
3. Tests de non-régression complets.
4. Observabilité, alertes, sauvegardes, runbooks et astreinte.
5. Soumission stores au plus tard avant le 25; prévoir le délai de revue Apple/Google.

## Critères GO production

- Zéro service critique arrêté.
- Login/refresh/logout admin et mobile validés en staging.
- Zéro endpoint critique frontend en 404.
- Zéro 403 inattendu avec la matrice RBAC validée.
- Paiement et remboursement réels validés avec idempotence.
- Emails transactionnels réels validés.
- Ticket QR/check-in anti-replay validé.
- Migrations testées sur copie de données.
- Kafka retry/DLQ/idempotence observables.
- Aucun secret réel dans Git; rotation terminée.
- Tests frontend/backend, build admin et builds mobile verts.

## Validation technique de cet audit

- Services Java modifiés: compilation Maven réussie pour Auth, Commerce, Ticket et Ads.
- Admin lint: aucune erreur, sept warnings restant à traiter.
- Admin TypeScript: des divergences Finance/Analytics ont été détectées puis corrigées; contrôle final à rejouer.
- Build admin: à rejouer après le dernier contrôle TypeScript.
- Tests E2E authentifiés: non exécutables sans credentials bootstrap connus et sans Ticket/Ads complètement opérationnels.

## Conclusion

YeYamo Admin est un **socle avancé de préproduction**, pas encore une console production certifiée. La priorité n’est plus d’ajouter des écrans: elle est de stabiliser les services, verrouiller les contrats, brancher les quelques features encore contextuelles/partielles et exécuter une recette E2E réelle avec les mêmes événements que le mobile.
