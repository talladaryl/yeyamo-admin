# Audit final — YeYamo Admin

Date de l’audit : 29 juillet 2026  
Périmètre : `yeyamo-admin`, contrats consommés via API Gateway et contrôleurs backend présents dans le monorepo.

## Synthèse

- **52 domaines fonctionnels audités**
- **35 COMPLETE**
- **17 BLOCKED_BY_BACKEND**
- **0 PARTIAL frontend restant**
- **0 MISSING frontend restant**
- **80 routes Next.js compilées**
- **18 tests automatisés réussis**
- Aucun écran actif ne dépend de données fictives.
- Les anciens fichiers `lib/api-client.ts` et `lib/mocks.ts`, seuls détenteurs de fallbacks silencieux, ont été supprimés.
- Les tokens YeYamo restent dans des cookies HttpOnly ; aucun token ou secret n’est stocké dans `localStorage`.

Un statut **BLOCKED_BY_BACKEND** signifie que l’interface, l’état indisponible et les adapters frontend sont prêts, mais qu’aucun contrat serveur persistant et sécurisé ne permet d’activer la fonction.

## Couverture par module

| # | Module | Statut | Route frontend | Contrat actuellement exploité |
|---:|---|---|---|---|
| 1 | Dashboard | COMPLETE | `/admin` | `GET /api/v1/analytics/admin/dashboard` |
| 2 | Platform Users | COMPLETE | `/admin/users`, `/admin/users/[id]` | `/api/v1/admin/platform-users` |
| 3 | Administrators | COMPLETE | `/admin/administrators/**` | CRUD `/api/v1/admin/users` |
| 4 | Partners | COMPLETE | `/admin/partners/**` | `GET /api/v1/partners`, détail partenaire |
| 5 | Partner KYC | COMPLETE | onglets et actions partenaires | `GET/PATCH /api/v1/admin/validations/partners` |
| 6 | Places | COMPLETE | `/admin/places/**` | catalogue/place APIs et formulaires |
| 7 | Regions | COMPLETE | `/admin/regions` | `/api/v1/regions` |
| 8 | Cities | COMPLETE | `/admin/cities` | `/api/v1/cities` |
| 9 | Districts | COMPLETE | `/admin/districts` | `/api/v1/districts` |
| 10 | Categories | BLOCKED_BY_BACKEND | `/admin/place-categories` | lecture disponible, écritures absentes |
| 11 | Catalog | COMPLETE | `/admin/catalog/**` | CRUD assets et statuts |
| 12 | Culture | COMPLETE | `/admin/culture` | assets catalog filtrés par attributs réels |
| 13 | Collections | COMPLETE | `/admin/collections/**` | CRUD `/api/v1/collections` |
| 14 | Imports | BLOCKED_BY_BACKEND | `/admin/catalog/imports/**` | création/détail présents, liste/retry/cancel absents |
| 15 | Events | COMPLETE | `/admin/events/**` | événements, détail, participants, statuts |
| 16 | Event calendar | COMPLETE | `/admin/events/calendar` | événements réels |
| 17 | Event ticketing admin | BLOCKED_BY_BACKEND | onglet Billetterie événement | scans présents, synthèse billetterie absente |
| 18 | Reservations | COMPLETE | `/admin/reservations/**` | booking-management, historique, cancel, complete |
| 19 | Payments | COMPLETE | `/admin/payments/**` | paiements admin/détail |
| 20 | Refunds | COMPLETE | `/admin/refunds`, détail paiement | liste et création refund avec idempotence |
| 21 | Promotions | COMPLETE | `/admin/promotions/**` | CRUD commerce promotions |
| 22 | Commissions | BLOCKED_BY_BACKEND | `/admin/commissions` | création disponible, lecture/historique absents |
| 23 | Ledger | COMPLETE | `/admin/ledger` | écritures, balance, mouvements, ajustements |
| 24 | Reports | COMPLETE | `/admin/moderation` | file de signalements |
| 25 | Moderation | COMPLETE | `/admin/moderation/**` | review et decision |
| 26 | Reviews | BLOCKED_BY_BACKEND | `/admin/reviews` | aucun endpoint admin global |
| 27 | Comments | BLOCKED_BY_BACKEND | `/admin/comments` | aucun endpoint admin global |
| 28 | Trust & Safety | COMPLETE | `/admin/trust/**` | `GET /api/v1/trust/{subjectId}` |
| 29 | Moderation Audit | COMPLETE | `/admin/moderation/audit` | `GET /api/v1/moderation/audit` |
| 30 | Missions | COMPLETE | `/admin/gamification/missions/**` | list/create/activate/pause |
| 31 | Badges | BLOCKED_BY_BACKEND | `/admin/gamification/badges` | API admin absente |
| 32 | XP Rules | BLOCKED_BY_BACKEND | `/admin/gamification/xp-rules` | API admin absente |
| 33 | Rewards | BLOCKED_BY_BACKEND | `/admin/gamification/rewards` | API admin absente |
| 34 | Gamification antifraud | BLOCKED_BY_BACKEND | `/admin/gamification/anti-fraud` | API admin absente |
| 35 | Campaigns | COMPLETE | `/admin/campaigns/**` | list/detail/approve/reject et scopes |
| 36 | Analytics global | COMPLETE | `/admin/analytics` | dashboard et KPI |
| 37 | Analytics users | COMPLETE | `/admin/analytics/users` | engagement utilisateur |
| 38 | Analytics partners | COMPLETE | `/admin/analytics/partners` | dashboard partenaire |
| 39 | Analytics places | COMPLETE | `/admin/analytics/places` | popularité |
| 40 | Analytics regions | COMPLETE | `/admin/analytics/regions` | activité région |
| 41 | Event logs | COMPLETE | `/admin/analytics/event-logs` | logs analytiques |
| 42 | Support inbox | BLOCKED_BY_BACKEND | `/admin/messages/**` | aucune API support desk |
| 43 | Newsletter | BLOCKED_BY_BACKEND | `/admin/newsletter/**` | aucune API newsletter |
| 44 | Search & Discovery | BLOCKED_BY_BACKEND | `/admin/search-discovery/**` | aucune API d’administration search |
| 45 | Admin notifications | COMPLETE | `/admin/notifications` | liste, unread count, read, read-all |
| 46 | General settings | BLOCKED_BY_BACKEND | `/admin/settings/general` | API de configuration absente |
| 47 | Roles | BLOCKED_BY_BACKEND | `/admin/settings/roles-permissions` | session effective uniquement |
| 48 | Permissions | BLOCKED_BY_BACKEND | `/admin/settings/roles-permissions` | matrice persistante absente |
| 49 | Feature Flags | BLOCKED_BY_BACKEND | `/admin/settings/feature-flags` | API absente |
| 50 | Security | COMPLETE | `/admin/settings/security` | vue non sensible des capacités actives |
| 51 | Admin sessions | COMPLETE | `/admin/settings/sessions` | list/revoke session courante |
| 52 | Audit Logs | COMPLETE | `/admin/settings/audit-logs` | `GET /api/v1/admin/audit-logs` |

## Endpoints backend encore nécessaires

### Catégories de lieux

- Écran : `/admin/place-categories`
- `POST /api/v1/place-categories`
- `PUT /api/v1/place-categories/{id}`
- `DELETE /api/v1/place-categories/{id}`
- Payload : `{ name, slug, parentId?, icon?, status? }`
- Réponse : `{ id, name, slug, parentId, icon, status, createdAt, updatedAt }`
- Exigences : pagination/listing déjà compatible, contrôle RBAC et conflit 409 sur slug utilisé.

### Imports catalogue

- Écrans : `/admin/catalog/imports`, `/admin/catalog/imports/[id]`
- `GET /api/v1/catalog/imports?page={page}&size={size}&status={status}`
- `POST /api/v1/catalog/imports/{id}/retry`
- `POST /api/v1/catalog/imports/{id}/cancel`
- Payload retry/cancel : `{ reason }`
- Réponse liste : `{ content, number, size, totalElements, totalPages }`
- Import attendu : `{ id, filename, status, totalRows, successfulRows, failedRows, errors, reportUrl?, createdAt, completedAt? }`

### Administration billetterie événement

- Écran : `/admin/events/{id}`, onglets Billetterie et Participants
- `GET /api/v1/tickets/admin/events/{eventId}/summary`
- `GET /api/v1/tickets/admin/events/{eventId}/tickets?page=&size=&status=`
- Réponse summary : `{ capacity, available, sold, scanned, cancelled, grossRevenue, currency, yeyamoCommission, occupancyRate }`
- Réponse tickets : page de `{ id, userId, ticketType, qrStatus, checkInStatus, scannedAt, status, amount, currency }`
- Ne jamais retourner le token QR brut.

### Historique des commissions

- Écran : `/admin/commissions`
- `GET /api/v1/commerce/admin/commissions?page=&size=&partnerId=&productType=&activeAt=`
- Réponse : page de `{ id, partnerId?, productType, percentage, fixedAmount, currency, validFrom, validTo?, createdBy, createdAt }`
- Les écritures restent créées via le POST déjà disponible.

### Reviews et Comments

- Écrans : `/admin/reviews`, `/admin/comments`
- `GET /api/v1/admin/reviews?page=&size=&status=&reported=&search=`
- `PATCH /api/v1/admin/reviews/{id}/status`
- `GET /api/v1/admin/comments?page=&size=&status=&reported=&search=`
- `PATCH /api/v1/admin/comments/{id}/status`
- Payload mutation : `{ status: "VISIBLE"|"HIDDEN"|"DELETED"|"LOCKED", reason }`
- Réponse : DTO incluant auteur, cible, texte sécurisé, score éventuel, reportCount, status et timestamps.

### Badges, règles XP, rewards et antifraude

- Écrans : `/admin/gamification/badges`, `xp-rules`, `rewards`, `anti-fraud`
- CRUD `/api/v1/gamification/admin/badges`
- CRUD `/api/v1/gamification/admin/xp-rules`
- CRUD `/api/v1/gamification/admin/rewards`
- `GET /api/v1/gamification/admin/fraud-alerts?page=&size=&status=`
- `POST /api/v1/gamification/admin/fraud-alerts/{id}/decision`
- Payload décision : `{ decision, reason }`
- Réponses : DTO versionnés avec statut, critères/règles structurés, stock, métriques réelles et audit actor dérivé du JWT.

### Support inbox

- Écrans : `/admin/messages`, `/admin/messages/{id}`
- `GET /api/v1/support/admin/conversations?page=&size=&status=&assignee=&search=`
- `GET /api/v1/support/admin/conversations/{id}`
- `POST /api/v1/support/admin/conversations/{id}/messages`
- `PATCH /api/v1/support/admin/conversations/{id}`
- `POST /api/v1/support/admin/conversations/{id}/notes`
- Payload message : `{ body, attachmentIds? }`; payload patch : `{ assigneeId?, status?, priority?, tags? }`
- Réponse : conversation, messages typés, notes internes séparées, contexte user/booking/payment/partner et SLA.

### Newsletter

- Écrans : `/admin/newsletter/**`
- CRUD `/api/v1/newsletter/admin/campaigns`
- `GET /api/v1/newsletter/admin/audiences`
- `POST /api/v1/newsletter/admin/campaigns/{id}/schedule`
- `POST /api/v1/newsletter/admin/campaigns/{id}/send`
- `POST /api/v1/newsletter/admin/campaigns/{id}/cancel`
- Payload campagne : `{ name, subject, preheader?, content, cta?, audienceId, scheduledAt? }`
- Réponse : campagne persistée avec status et statistiques delivered/failed/opened/clicked/unsubscribed.

### Search & Discovery administration

- Écrans : `/admin/search-discovery/**`
- `GET /api/v1/search/admin/health`
- `GET /api/v1/search/admin/indexes`
- CRUD `/api/v1/search/admin/synonyms`
- CRUD `/api/v1/search/admin/ranking-policies`
- `GET /api/v1/search/admin/zero-results?from=&to=&region=&page=&size=`
- `POST /api/v1/search/admin/reindex`
- Payload reindex : `{ indexes, reason }`
- Réponses : états OpenSearch synthétiques sans credentials, jobId/status/progress pour reindex.

### Gouvernance générale, rôles, permissions et feature flags

- Écrans : `/admin/settings/general`, `roles-permissions`, `feature-flags`
- `GET/PUT /api/v1/admin/settings/general`
- `GET /api/v1/admin/roles`
- `GET /api/v1/admin/permissions`
- `PUT /api/v1/admin/roles/{role}/permissions`
- CRUD `/api/v1/admin/feature-flags`
- Payload général : `{ platformName, maintenanceMode, functionalConfiguration, systemLimits }`
- Payload matrice : `{ permissions, scopes, reason }`
- Payload flag : `{ key, description, environment, enabled, rolloutPercentage }`
- Réponses : versions sans secrets, `updatedBy`, `updatedAt`, version optimiste et audit.

## Endpoints utilisés par domaine

- Auth : `/api/v1/auth/login`, `logout`, `refresh`, `sessions`
- Utilisateurs : `/api/v1/admin/platform-users/**`
- Administrateurs : `/api/v1/admin/users/**`, `/api/v1/admin/audit-logs`
- Partenaires/KYC : `/api/v1/partners/**`, `/api/v1/admin/validations/partners/**`
- Géographie : `/api/v1/regions`, `cities`, `districts`, `places`, `maps/reverse-geocode`
- Catalogue : `/api/v1/catalog/assets/**`, `catalog/imports/**`, `collections/**`
- Événements : `/api/v1/events/**`, participants, scans tickets et analytics ticket-event
- Réservations : `/api/v1/booking-management/bookings/**`, `/api/v1/bookings/**`
- Finance : `/api/v1/payments/**`, `/api/v1/commerce/admin/**`
- Modération : `/api/v1/moderation/reports/**`, audit et trust
- Gamification : `/api/v1/missions`, `/api/v1/mission-management/missions/**`
- Campagnes : `/api/v1/admin/campaigns/**`
- Analytics : dashboard, KPI, event logs, régions, partenaires, lieux, utilisateurs et rebuild
- Notifications : `/api/v1/notifications/**`

## Authentification et sécurité

- Login via route serveur Next.js ; le navigateur ne reçoit pas les JWT.
- Access token et refresh token stockés en cookies HttpOnly, Secure, SameSite.
- Logout backend puis suppression des cookies.
- Retry automatique unique après 401.
- Refresh simultané mutualisé par une promesse unique.
- Redirection login si refresh impossible.
- Session admin chargée depuis `/api/auth/session`.
- RBAC, permissions et scopes utilisés pour navigation et actions ; le backend reste l’autorité.
- Les approbations campagnes vérifient `campaign:approve` et `campaign:reject`.
- Les deep links de notifications utilisent une liste blanche de routes et d’identifiants.
- Aucun secret, JWT ou refresh token n’est journalisé ou stocké côté navigateur.
- Les mutations financières critiques utilisent `Idempotency-Key` et aucun optimistic update.

## UX transversale

- TanStack Query centralisé avec retry limité, cache et erreurs globales.
- `ApiError` uniforme : status, code, message, correlationId et details.
- DataTable : loading, empty, error, tri, sélection, pagination, scroll responsive et header fixe.
- Toasts, confirmations, dialogues destructifs, skeletons et états indisponibles partagés.
- Dialogues : focus initial, focus trap, Escape et restauration du focus.
- Onglets navigables au clavier.
- Breakpoints vérifiés structurellement pour 1440, 1280, 1024 et 768 px.
- Mapbox est chargé dynamiquement uniquement sur les formulaires géographiques.

## Typage et qualité

- Les features stables possèdent leurs DTO métier dédiés.
- Zod protège les formulaires sensibles disponibles.
- Aucun `any` évitable détecté dans les features.
- `ApiRecord` subsiste uniquement dans l’ancien adaptateur générique de compatibilité de la route catch-all ; aucune feature métier finalisée ne l’utilise.
- `lib/api/admin-api.ts` reste utilisé par le dashboard et la compatibilité catch-all. Il ne doit pas être étendu pour de nouvelles features.
- Aucun `console.log` ou `console.debug` de production détecté.
- Aucun fallback mocké de production ne subsiste.

## Tests

- `tests/admin-login-form.test.tsx` : erreurs login, payload et double soumission.
- `tests/api-client.test.ts` : succès API, refresh 401 et ApiError.
- `tests/rbac.test.ts` : rôles, permissions et scopes.
- `tests/admin-data-table.test.tsx` : loading, empty, error, données, pagination, tri et sélection.
- `tests/admin-foundation.test.tsx` : statuts, dialogues et clavier.
- `tests/finance-api.test.ts` : idempotence refund et ledger.
- Résultat lors de l’audit : 18 tests réussis.

## Dette technique restante

1. Les cinq avertissements `react-hooks/exhaustive-deps` concernent les helpers URL/debounce de listes. Ils ne bloquent ni TypeScript ni le build, mais doivent être résolus par stabilisation de `update` dans `useAdminUrlState`, pas par désactivation ESLint.
2. Une image utilisateur distante utilise encore `<img>`; migrer vers `next/image` exige une politique backend de domaines média fiable.
3. Recharts reste un bundle important sur les routes analytics ; un découpage par graphique pourra être ajouté si les métriques Web Vitals le justifient.
4. Le catch-all et `ApiRecord` sont conservés uniquement pour compatibilité avec une route historique cachée. Leur suppression nécessite une décision explicite sur `/admin/places-events`.
5. Les tests E2E login/protected routes nécessitent un environnement backend de test et restent documentés dans `docs/testing-strategy.md`.

## Conclusion

Tout élément réalisable uniquement côté frontend possède une route, une interface réelle ou un état d’indisponibilité explicite, un adapter isolé et les protections UX nécessaires. Les fonctionnalités non activables sont toutes classées **BLOCKED_BY_BACKEND** avec le contrat attendu ci-dessus. Aucun mock ne masque un endpoint manquant.
