# YeYamo Admin Web

## Objet

Ce dépôt vise la réalisation du **dashboard administrateur web** de YeYamo.

L'application n'est pas une interface mobile d'administration. C'est un **back-office desktop-first**, conçu pour des écrans larges, avec une logique orientée :

- validation
- modération
- pilotage produit
- gestion du catalogue culturel et touristique
- suivi des partenaires
- analytics

## Ce que le document demande

Le PDF de cadrage décrit un **centre de contrôle administrateur** pour la plateforme YeYamo.

Le front doit permettre de :

- valider ou rejeter des partenaires et leurs documents KYC
- gérer les utilisateurs et leurs statuts
- modérer les posts, commentaires, stories et médias
- administrer le National Discovery Catalog
- gérer les contenus Culture & Mémoire
- suivre les lieux, événements et expériences
- piloter notifications, campagnes, discovery et analytics
- administrer les rôles, permissions et logs d'audit

## Position produit comprise

YeYamo est présenté comme une plateforme sociale de découverte locale et de valorisation du Cameroun.

Le dashboard admin doit donc servir à la fois à :

- contrôler la qualité des données
- protéger la plateforme
- suivre l'activité opérationnelle
- soutenir le positionnement culturel et patrimonial du produit

## Stack front attendue

Le document recommande explicitement :

- `Next.js` avec `App Router`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `TanStack Table`
- `TanStack Query`
- `React Hook Form`
- `Zod`
- `Recharts`
- `Mapbox GL JS`

## Principes UX retenus

- interface **desktop-first**
- design sobre, institutionnel, rouge/blanc/gris
- écrans orientés action
- traçabilité visible sur les décisions sensibles
- filtres, recherche, tables riches, badges de statut
- aperçu avant validation, publication ou sanction
- navigation adaptée aux rôles

## Modules identifiés

Le document structure l'admin autour de ces domaines :

1. Auth & sécurité
2. Dashboard général
3. Utilisateurs
4. Partenaires & KYC
5. National Discovery Catalog
6. Culture & Mémoire
7. Lieux, événements & expériences
8. Modération sociale & médias
9. Trust & Safety
10. Gamification, missions & rewards
11. Notifications & campagnes
12. Search, Discovery & feature flags
13. Analytics & rapports
14. Paramètres plateforme & audit
15. Support & helpdesk

## Ce qui semble prioritaire pour la V1

Le document distingue beaucoup d'interfaces, mais la V1 réaliste doit se concentrer sur un noyau solide.

Priorité de réalisation comprise :

- socle admin réutilisable
- authentification admin
- layout global
- RBAC côté UI
- dashboard général
- utilisateurs
- partenaires & KYC
- catalogue assets
- lieux
- corrections
- modération principale

## Composants transverses indispensables

Avant de multiplier les pages, il faut construire des composants partagés :

- `AdminDataTable`
- `StatusBadge`
- `DecisionModal`
- `RightPreviewDrawer`
- `MediaViewer`
- `MapReviewPanel`
- `AuditTimeline`
- `SourceLineagePanel`
- `RichContentEditor`
- `KpiCard` / `ChartCard`
- `EmptyState` / `ErrorState`
- `CommandPalette`

## Contraintes importantes

- toutes les pages doivent gérer `loading`, `empty`, `error`, `unauthorized`, `success`
- toute action sensible doit demander confirmation
- les rejets, suppressions, suspensions et validations doivent conserver un motif
- les permissions doivent agir sur les menus, les actions et les routes
- les détails doivent conserver le contexte de navigation et les filtres
- les médias sensibles ne doivent apparaître qu'en contexte autorisé

## Structure cible suggérée

Le document recommande une structure de ce type :

```text
app/
  (auth)/login/
  (dashboard)/admin/
    users/
    partners/
    catalog/
    culture/
    places-events/
    moderation/
    trust/
    gamification/
    campaigns/
    search-discovery/
    analytics/
    settings/
components/
features/
lib/
design-system/
tests/
```

## Lecture synthétique

Ce projet doit être construit comme une **console d'administration métier**, dense et modulaire, pas comme un site marketing.

Le vrai enjeu n'est pas de produire rapidement beaucoup d'écrans isolés, mais de mettre en place un **socle admin robuste** qui permettra ensuite de livrer les modules métier sans dérive UX ni dette structurelle.

## Suite attendue

La prochaine étape est d'intégrer les **services/backend contracts** que tu vas fournir pour :

- aligner les modules sur les vraies ressources métier
- définir les routes, appels API et états de chargement
- prioriser ce qui sera mocké, branché ou différé
- transformer ce cadrage en plan d'implémentation concret
