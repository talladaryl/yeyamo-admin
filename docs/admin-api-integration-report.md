# Audit et intégration des API d'administration

## État initial

- L'application Next.js contenait une maquette de dashboard alimentée exclusivement par `lib/mocks.ts`.
- Le formulaire de connexion n'appelait aucune API et un lien permettait d'ouvrir directement le dashboard.
- `lib/api-client.ts` masquait toutes les erreurs backend en retournant silencieusement des mocks.
- Les pages métier étaient des pages descriptives sans chargement, mutation, authentification ni contrôle de session.

## Architecture intégrée

- Le navigateur appelle uniquement les Route Handlers Next.js sous `/api`.
- Le login est relayé vers `POST /api/v1/auth/login`.
- Les JWT YeYamo sont conservés dans des cookies `HttpOnly`, jamais dans `localStorage`.
- Le proxy `/api/backend/**` utilise une liste blanche de domaines administratifs et transmet le Bearer token au Gateway.
- Les erreurs backend sont visibles dans l'interface et ne déclenchent plus de fallback mock.

## Couverture des interfaces

| Interface | API consommée | État |
|---|---|---|
| Dashboard | `GET /api/v1/analytics/admin/dashboard` | Connectée |
| Administrateurs | `/api/v1/admin/users` | Liste connectée, client CRUD disponible |
| Validations partenaires | `/api/v1/admin/validations/partners` | Liste, approbation, rejet |
| Validations lieux | `/api/v1/admin/validations/places` | Liste, approbation, demande de corrections |
| Signalements historiques | `/api/v1/admin/reports` | Liste, résolution |
| File de modération | `/api/v1/moderation/reports` | Liste, prise en revue, décision |
| Catalogue / Culture | `GET /api/v1/catalog/assets` | Liste connectée |
| Missions | `/api/v1/missions`, `/api/v1/mission-management/**` | Liste, activation, pause |
| Campagnes | `/api/v1/admin/campaigns` | Liste, approbation, rejet |
| Analytics | `GET /api/v1/analytics/kpis` | Liste connectée |
| Paramètres / Audit | `GET /api/v1/admin/audit-logs` | Liste connectée |

## API backend présentes sans interface complète

- CRUD complet des administrateurs : formulaires de création et modification à finaliser.
- Historique ciblé et création d'actions via `/api/v1/admin/moderation-actions`.
- Détail d'une campagne et pagination/filtrage avancé.
- Promotions, commissions et ledger de `commerce-service` : clients disponibles mais aucun écran dédié dans la navigation actuelle.
- Imports catalogue : soumission et suivi par identifiant, sans écran de gestion de jobs.
- CRUD des assets et références catalogue, lieux, régions, villes, districts et événements.
- Analytics détaillées par région, partenaire, lieu, utilisateur et reconstruction des projections.
- Recherche de trust score par sujet et journal d'audit de moderation-trust-service.
- Gestion des slots, clôture et complétion de réservation ; aucun endpoint de liste globale des réservations.
- Remboursement de paiement ; aucun endpoint admin de recherche/liste globale des paiements.

## API absentes bloquant l'administration

- Utilisateurs plateforme : liste globale paginée, recherche, détail administratif, suspension/réactivation, rôles et export.
- Réservations : liste globale admin avec filtres, détail enrichi, litiges et agrégats.
- Paiements : liste globale, recherche, rapprochement, détail administratif et historique de remboursements inter-utilisateurs.
- Événements : liste globale de management avec filtres admin ; les routes actuelles sont orientées créateur/public.
- Avis et commentaires : file globale, détail, masquage/restauration et historique ; seul le signalement générique existe.
- Messagerie support : inbox admin, assignation, SLA, recherche et macros.
- Newsletter : campagnes, audiences, envois et métriques.
- Search & Discovery : statut d'index, reindexation, ranking policies, feature flags et reason codes.
- Configuration plateforme : paramètres, feature flags et gestion centralisée des permissions.
- Notifications admin : centre d'alertes et compteur réel pour remplacer le badge statique.

## Interfaces frontend absentes

- Formulaires CRUD structurés avec validation pour utilisateurs admin, catalogue, lieux et événements.
- Pages de détail, pagination, filtres, tri, recherche et export.
- Interfaces promotions/commissions/ledger, imports, paiements/remboursements et booking management.
- Recherche de trust score et historique des actions de modération par cible.
- Gestion du challenge Turnstile adaptatif si le backend retourne `TURNSTILE_REQUIRED` au login admin.
- Renouvellement automatique du refresh token et affichage de l'identité/du rôle connecté.
- Contrôle RBAC côté interface par rôle et scopes ; le backend reste actuellement l'autorité effective.

## Risques et écarts backend

- `admin-service` gère des comptes administrateurs distincts des utilisateurs plateforme ; `/api/v1/admin/users` ne répond donc pas au besoin “Utilisateurs”.
- `campaign-service` exige des authorities `SCOPE_campaign:*`, tandis que l'authentification YeYamo expose surtout des rôles : vérifier la génération des scopes dans le JWT.
- Le Gateway route actuellement `/api/v1/admin/**` vers `admin-service` avant toute route spécifique : `/api/v1/admin/campaigns` de `campaign-service` est donc inaccessible via le Gateway tant qu'une route plus spécifique et prioritaire n'est pas ajoutée.
- Plusieurs contrôleurs admin de services récents reposent sur leur sécurité globale sans annotation méthode explicite.
- Les DTO de review acceptent `validatedBy`, `reviewedBy` ou `resolvedBy` depuis le body ; l'identité devrait idéalement provenir exclusivement du JWT.
- Le dashboard analytics ne fournit pas la structure riche attendue par l'ancienne maquette ; l'interface affiche donc fidèlement le contrat réel.
