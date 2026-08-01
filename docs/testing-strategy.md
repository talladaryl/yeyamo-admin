# Stratégie de tests YeYamo Admin

## Pyramide

- **Unitaires** : permissions, mappers, schémas Zod, normalisation des statuts et génération des requêtes.
- **Composants** : états loading/empty/error, pagination, tri, filtres, dialogues, prévention du double submit et accessibilité clavier.
- **Intégration frontend** : client API, refresh token, erreurs typées, invalidation TanStack Query et mutations critiques.
- **E2E à ajouter en CI** : login, routes protégées et parcours métier avec un environnement backend dédié. Aucun fallback de production vers des mocks.

## Modules critiques

Users, Administrators, Partners, Places, Events, Reservations, Payments, Moderation et Campaigns doivent conserver au minimum un test de liste, erreur API, permission et mutation principale lorsque leurs contrats évoluent.

## Commandes

- `npm test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

Les mocks HTTP sont limités aux tests. Ils ne doivent jamais être importés par le code de production.
