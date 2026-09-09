# DESIGN SYSTEM, RESPONSIVE ET SHELLS CIBLES — YEYAMO WEB

> Date : 9 septembre 2026  
> Statut : conception uniquement  
> Convention : **EXISTANT** désigne une preuve dans le code; **CIBLE — NON ENCORE IMPLÉMENTÉ** une décision de conception; **À VALIDER PRODUIT** une décision visuelle non démontrée par le repository.

## 1. Résumé exécutif

Le Design System cible conserve l’identité constatée : rouge Yeyamo, surfaces claires bleu-gris, forts contrastes sur média, cartes généreusement arrondies, iconographie simple et expérience visuelle centrée sur les lieux, personnes et cultures. Mobile Web préserve la hiérarchie et la bottom navigation du Mobile; Tablet introduit un rail; Desktop utilise sidebar, contenu maîtrisé et panneau contextuel optionnel.

Le système cible comprend 32 tokens couleur sémantiques par thème, 9 styles typographiques, 12 espacements, 6 rayons, 4 bordures, 4 ombres, 8 niveaux z-index, 5 durées/mouvements, 6 breakpoints fonctionnels, 4 containers, 5 shells, 7 variantes de layout et 28 primitives. L’Admin reste visuellement et techniquement inchangé sous `.admin-app`.

## 2. Sources analysées

- `AUDIT_ALIGNEMENT_MOBILE_WEB.md` et `ARCHITECTURE_YEYAMO_WEB.md`, lus intégralement.
- Web : `app/globals.css`, `app/(dashboard)/admin/admin.css`, `lib/public/design-tokens.ts`, `lib/public/cn.ts`, `app/providers.tsx`, landing et composants Admin.
- Mobile : `src/constants/theme.ts`, `tailwind.config.js`, `src/components/ui/**`, Feed, Explorer, Profile, Partner Dashboard et sheets.
- Packages observés : Tailwind 4, Lucide, Framer Motion, CVA, clsx, tailwind-merge, Recharts et Mapbox GL.

## 3. Audit visuel Web existant

| Élément | Existe | Public | Partner | Admin only | À refactoriser |
|---|:---:|:---:|:---:|:---:|:---:|
| fonts Heading + Inter | oui | oui | oui | non | non |
| variables landing `:root` | oui | base | base | non | oui, sémantiser |
| `publicDesignTokens` | oui | oui | oui | non | oui, aligner CSS |
| `cn` clsx + twMerge | oui | oui | oui | non | non |
| Framer Motion | oui | oui | oui | non | limiter |
| Lucide | oui | oui | oui | non | non |
| landing cards/header/FAQ | oui | partiel | non | non | dissocier marketing |
| Admin foundation/dialog/table/toast | oui | pattern seulement | pattern seulement | oui | ne pas importer directement |
| Admin tokens `.admin-app` | oui | non | non | oui | conserver |
| skeleton/empty/error Admin | oui | concept | concept | oui | primitives publiques neuves |
| CVA | package présent | oui | oui | possible | usage cible |

Risques observés : `globals.css` contient toute la landing; `--surface-warm` est déclaré deux fois; rouge landing `#E50914`, Mobile `#EF4444` et Admin `#D90416/#E30613` divergent; `AppProviders` monte Toast et Session Admin globalement.

## 4. Audit du langage Mobile

| Principe Mobile | Présence | Token Web | Adaptation |
|---|---|---|---|
| rouge principal `#EF4444` | forte | accent/action | vérifier contraste texte fin |
| fond light bleu-gris `#F1F5F9` | thème | bg | oui |
| dark navy `#0B1420` | thème | bg dark | oui |
| surfaces/cartes étagées | thème | surface levels | oui |
| cards `rounded-xl/2xl/3xl` | forte | radius md/lg/xl | réduire en dense |
| spacing 4–64 | constants | spacing scale | compléter 2, 12, 20, 40, 80 |
| texte 11–36 | constants | type scale | responsive fluide limité |
| bottom nav 5 actions | tabs | shell mobile | conserver |
| Feed noir immersif | feed | media canvas | Desktop contenu, pas écran entier |
| sheets arrondies 30 px | explore/profile | overlay mobile | dialog Desktop |
| cards Partner visuelles | dashboard | density standard | tables Desktop |
| dark/light/system | store | thèmes Web | conserver intention |
| états spinner/empty | écrans | state primitives | enrichir accessibilité |

## 5. Identité Yeyamo

Personnalité : chaleureuse, contemporaine, culturelle, accessible et visuelle. Le rouge sert à l’action et à la reconnaissance, pas à colorer toutes les surfaces. Les photographies sont authentiques, contextualisées et dominantes. L’espace blanc/bleu-gris sépare les contenus; les cartes structurent sans transformer chaque bloc en « carte ». Iconographie Lucide simple; illustrations/mascotte réservées au marketing, empty states choisis et moments de marque. **À VALIDER PRODUIT** : usage exact de la mascotte dans le produit et rôle du bleu story `#1689FF`.

## 6. Tokens couleurs

**CIBLE — NON ENCORE IMPLÉMENTÉ** : 32 tokens sémantiques, chacun mappé light/dark :

`--yy-bg`, `--yy-bg-subtle`, `--yy-surface`, `--yy-surface-raised`, `--yy-surface-sunken`, `--yy-surface-overlay`, `--yy-text-primary`, `--yy-text-secondary`, `--yy-text-muted`, `--yy-text-inverse`, `--yy-border-subtle`, `--yy-border`, `--yy-border-strong`, `--yy-accent`, `--yy-accent-hover`, `--yy-accent-active`, `--yy-accent-soft`, `--yy-on-accent`, `--yy-danger`, `--yy-danger-soft`, `--yy-success`, `--yy-success-soft`, `--yy-warning`, `--yy-warning-soft`, `--yy-info`, `--yy-info-soft`, `--yy-focus`, `--yy-overlay`, `--yy-media-canvas`, `--yy-media-gradient`, `--yy-link`, `--yy-selection`.

Light part de `themeColors.light` et `publicDesignTokens`; dark part de `themeColors.dark`. Partner change la densité, pas la palette. Admin conserve `--admin-*`.

## 7. Typographie

Fonts existantes : Heading Regular/Semibold et Inter Regular/Semibold via `next/font/local`. Cible : Heading pour display/H1/H2; Inter pour body/UI; fallback `system-ui, sans-serif`. Poids disponibles réellement : 400 et 600; 700/800 ne doivent pas être simulés sans validation/asset.

| Style | Mobile | Desktop | Line-height | Tracking |
|---|---|---|---|---|
| Display | 40 | 56 | 1.00 | -0.04em |
| H1 | 32 | 44 | 1.08 | -0.03em |
| H2 | 26 | 34 | 1.15 | -0.02em |
| H3 | 22 | 26 | 1.2 | -0.015em |
| H4 | 18 | 20 | 1.3 | 0 |
| Body Large | 17 | 18 | 1.55 | 0 |
| Body | 15 | 16 | 1.55 | 0 |
| Body Small | 13 | 14 | 1.45 | 0 |
| Label/Caption | 12/11 | 13/12 | 1.35 | 0.01em |

## 8. Spacing

Échelle cible : `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` px; 12 valeurs non nulles. Icône/texte 8–12; padding card 16 mobile, 20–24 desktop; gutter page 16/24/32; section gap 32/48/64; grid gap 12/16/24; modal 20/24/32; champs 12–16 vertical; groupes formulaire 24–32.

## 9. Radius / Border / Shadow

Rayons : xs 6, sm 10, md 14, lg 18, xl 24, pill 999 px. Bordures : subtle 1 px faible contraste, standard 1 px, strong 2 px, focus 2 px + offset. Ombres : none; subtle (cards interactives); raised (sticky/popup); overlay (modal). Les valeurs existantes 12/16/24/32 sont normalisées; le Feed mobile peut être sans rayon, Desktop 16–24.

## 10. Z-index

Échelle : content 0, media-controls 10, sticky 20, navigation 30, dropdown 40, popover/map-controls 50, drawer/modal 70, toast 90. Mapbox interne reste encapsulé; aucun marqueur ne dépasse overlay. Les valeurs Admin 100/200 restent dans son contexte d’empilement.

## 11. Motion

Durées : instant 0, fast 120, standard 200, emphasized 320, ambient 600 ms. Easing standard `[0.16,1,0.3,1]`, emphasized `[0.22,1,0.36,1]`. Hover 120–160; dialog 200; drawer/sheet 240–320; navigation 160; skeleton 1200–1600 boucle; entrée card seulement pour contenu initial, pas chaque scroll. `prefers-reduced-motion` supprime déplacements, autoplay décoratif et smooth scroll.

## 12. Breakpoints

| Breakpoint | Largeur | Navigation | Colonnes | Container |
|---|---|---|---|---|
| compact | 320–374 | bottom | 1 | fluid 16 |
| mobile | 375–767 | bottom | 1–2 | fluid 16 |
| tablet | 768–1023 | rail 72 | 2–3 | fluid 24 |
| laptop | 1024–1199 | rail 80 | 2–3 | fluid 24 |
| desktop | 1200–1919 | sidebar 240–264 | 3–5 | max 1680 |
| wide | ≥1920 | sidebar 264 | max 4–6 | max 1680 |

Le changement structurel Desktop reste 1200; 1024 sert à optimiser Tablet paysage, pas à activer trois colonnes partout.

## 13. Containers

`content-narrow` 720 px (lecture/forms simples), `content-standard` 1120 px, `content-wide` 1440 px, `content-fluid` 100 % avec plafond shell 1680 px. Gutters 16/24/32/40 selon breakpoint. Map, Chat et Dashboard peuvent remplir l’espace après navigation; aucune grille ne s’étire à 2500 px.

## 14. Shell Mobile

Header 56 px nominal, bottom nav 60 px + safe-area. Navigation fixed seulement si elle ne masque pas clavier/contenu; main reçoit padding safe. Au clavier, bottom nav peut se cacher; actions de formulaire restent visibles sans double sticky. En paysage court, header se compacte et Feed/Map privilégient contenu; navigation reste accessible via barre compacte ou menu.

## 15. Shell Tablet

Rail fixe/sticky 72 px, icônes + labels courts sous ou via tooltip accessible; à partir de 1024 px, rail 80–88 px avec labels visibles. Non expandable par défaut pour éviter reflow. Portrait garde rail compact; paysage permet context panel si main ≥600 px.

## 16. Shell Desktop

Sidebar 240 px à 1200–1439, 264 px à partir de 1440. Main minimum 560 px, flexible. Context panel 320 px standard, 360 px wide; il disparaît avant que main passe sous son minimum. Shell max 1680 px centré. À 1366 : sidebar 240 + main, sans panel; 1440 : panel seulement sur détails; 1600 : panel 320 possible; 1920+ : panel courant, gutters grandissent; 2560 : même largeur utile centrée.

## 17. Variantes de Layout

| Variante | Mobile | Tablet | Desktop | Width/scroll/sticky |
|---|---|---|---|---|
| FeedLayout | plein média | rail + média | média + panel opt. | main 560–720; snap local prudent |
| DiscoveryLayout | toolbar + liste | rail + grid | filtres + grid | wide; document scroll |
| DetailLayout | pile + CTA bas | 2 colonnes si possible | main + CTA | standard; CTA sticky |
| ReadingLayout | 1 colonne | 1 colonne | texte + sommaire | narrow; document scroll |
| ChatLayout | liste → thread | 2 panneaux | 3 panneaux | fluid; scrolls locaux |
| FormLayout | 1 colonne | 1 colonne large | form + preview | narrow/standard; actions opt. sticky |
| DashboardLayout | cards | rail + grids | sidebar + tables/charts | fluid; header sticky optionnel |

## 18. Feed Layout

Média Desktop min 480, idéal 600–640, max 720 px; hauteur max `viewport - chrome`, minimum fonctionnel 520 px. 9:16 et 4:5 : contain dans canvas sombre; 1:1 : centré; 16:9 : pleine largeur avec espace vertical; multi-image : carousel avec ratio stable par post. Player `--yy-media-canvas`; letterboxing assumé. Auteur/caption au bas du média avec gradient; actions dans rail 48 px; commentaires dans panel, jamais au-dessus des contrôles.

## 19. Feed 1366/1440/1920/2560

```text
1366: | Sidebar 240 |   Main 760: [Media 600][Actions]   | gutters |
       Right panel absent; suggestions sous le lot.

1440: | Sidebar 240 | Main 760: [Media 600][Actions] | Panel 320? |
       Panel réservé post/commentaires, masqué Feed si compression.

1920: | gap | Sidebar 264 | Main 820: [Media 640][Actions] | Panel 340 | gap |
       Shell centré; média ne dépasse pas 720.

2560: | large outer space | Sidebar 264 | Main 840 | Panel 360 | large outer space |
       Shell max 1680; aucune croissance proportionnelle du média.
```

## 20. Feed Mobile

Identique au Mobile : ordre média/auteur/caption/actions, gestes verticaux et bottom nav. Différences Web : unités `dvh/svh`, barres navigateur, contrôle natif/HTML vidéo, hover absent, roue/clavier possibles, partage Web. Scroll-snap `proximity` recommandé, pas `mandatory`, afin de préserver zoom, liens et contenus longs. En paysage, vidéo 16:9 prioritaire; 9:16 reste contain avec informations latérales si largeur suffisante.

## 21. Explorer

Mobile : catégories horizontales, recherche, sections et cartes. Desktop : toolbar search/chips sticky légère, filtres latéraux si >3 critères, grille mixte mais alignée. Les familles Yeyamo sont regroupées par sections, pas mélangées sans signal. Cards 240–320 px selon domaine; gaps 16/24. Infinite scroll pour découverte générale, pagination ou « voir plus » pour sections SEO.

## 22. Grid System

| Domaine | Mobile | Tablet | Desktop | Wide max |
|---|---:|---:|---:|---:|
| Places/Events/Experiences | 1 | 2 | 3–4 | 4 |
| Artisans | 2 compactes ou 1 riche | 3 | 4 | 5 |
| Artworks | 2 | 3 | 4–5 | 5 |
| Culture | 1 | 2–3 | 3–4 | 4 |
| Search mixte | 1 | 2 | 3–4 | 4 |

Utiliser `minmax` avec largeur minimale de carte; ne jamais ajouter une sixième colonne si texte, prix ou CTA deviennent illisibles.

## 23. Detail Layout

Mobile : galerie, identité, contenu, sections, CTA sticky limité. Tablet : colonne principale + CTA 280 px si largeur. Desktop : main 720–900, aside 320–360 sticky avec offset navigation. Galerie peut dépasser le texte mais reste dans container. L’aside disparaît/revient dans le flux à 200 % zoom.

## 24. Post Detail

Desktop : media/post 60–68 %, commentaires 32–40 %, hauteur maximale viewport avec scroll commentaires indépendant; page directe garde header et canonical. Mobile : commentaires sheet 90 % ou section navigable; focus composer accessible. Overlay Desktop possible depuis Feed, mais page complète reste référence.

## 25. Chat

Mobile : liste → thread → info. Tablet : conversations 280 px + thread. Desktop : 300 px + thread min 480 + info 300 px optionnel. Header/composer sticky dans leur panneau; messages scrollent. À 200 % zoom, revenir à deux puis un panneau. Unread, failed et sending ont texte/icône, pas couleur seule.

## 26. Map

Mobile : map ou liste, contrôle bascule visible. Tablet/Desktop : split 40/60 ou 45/55, poignée seulement si accessible; toolbar au-dessus. Contrôles Mapbox regroupés, touch target 44 px; markers clusterisés; sélection persistante. Une liste équivalente reste disponible pour clavier/screen reader.

## 27. Reading

Culture, proverbes, recettes et leçons utilisent `content-narrow`; ligne 65–80 caractères, body 16–18, interligne 1.6. Sommaire en aside Desktop, drawer Tablet/Mobile. Audio/transcription proche du contenu; images avec légende; actions secondaires après l’article.

## 28. Forms

Formulaire simple max 560–640 px; complexe 880–1120 avec sections et preview 320–400. Labels persistants au-dessus, aide puis erreur, required explicite. Desktop peut faire deux colonnes seulement pour champs courts liés; mobile reste une colonne. Les gros wizards Mobile deviennent sections avec résumé et sauvegarde brouillon si backend le permet.

## 29. Partner Dashboard

Sidebar métier 248–264 px Desktop, rail Tablet, drawer Mobile. KPI 2 colonnes mobile, 2–3 tablet, 4 desktop; tables paginées; charts 280–360 px hauteur; actions primaires contextuelles. Densité standard/compacte sans atteindre l’Admin. Le contexte établissement/événement est toujours visible.

## 30. Partner vs Admin

Partner : marque Yeyamo, cartes visuelles, contenus propres, langage « votre activité », navigation courte, rouge d’accent, densité standard. Admin : gris utilitaire, tables denses, modération globale, rôles/scopes, `.admin-app`. Partner n’importe pas `AdminShell`, `AdminDataTable`, `AdminDialog` ou classes `.admin-*`; seules idées d’accessibilité peuvent être réimplémentées dans les primitives communes.

## 31. Navigation

Desktop Public : logo, Feed, Explorer, Create, Messages, Notifications, Profile/Login. Tablet : rail. Mobile : cinq tabs Feed/Explore/Create/Messages/Profile. Create est accentué mais ne domine pas tout. Navigation active combine couleur, forme et `aria-current`; badges unread plafonnés `99+`; catégories secondaires restent dans Explorer/Profile.

## 32. Create Action

Desktop : bouton + menu/popover ou modal compacte; Tablet : dialog; Mobile : bottom sheet. Options adaptées au rôle, chacune avec icône, label et aide courte. Visiteur ouvre l’auth contextuelle. Le menu ferme après navigation et restaure le focus; pas de carrousel de choix.

## 33. Primitives UI

28 primitives cibles : Button, IconButton, LinkButton, Input, Textarea, Select, Checkbox, Radio, Switch, SearchField, Field, FormError, Avatar, Badge, Chip, Tag, Card, Divider, Tabs, Breadcrumb, Tooltip, Popover, Dialog, Drawer, Sheet, Toast, Skeleton, EmptyState/ErrorState (comptées comme deux, total 29 si séparées; compteur officiel les regroupe en `State`).

## 34. Buttons

Variants : primary, secondary, outline, ghost, danger, inverse. Sizes : sm 36, md 44, lg 52 px; icon-only min 44 public, 38 Partner compact avec zone cible 44. États complets; spinner ne change pas largeur; label reste annoncé. Rouge primary; danger possède token distinct même si Mobile les confond actuellement.

## 35. Cards

Familles : ContentCard, MediaCard, PlaceCard, EventCard, ExperienceCard, CultureCard, ArtisanCard, ArtworkCard, ProfileCard, StatCard, TransactionCard, MessagePreviewCard, Empty/PromoCard — 13. Une carte cliquable a un lien principal sémantique; actions internes séparées. Ratio média défini par famille; hover élévation légère, touch état pressé.

## 36. Media

Primitives : ResponsiveImage, MediaFrame, VideoPlayer, MediaCarousel, Gallery, AvatarMedia, Poster. Ratios déclaratifs 9:16, 4:5, 1:1, 3:2, 16:9; placeholder dimensionné; erreur visuelle. `cover` pour cards, `contain` pour consultation intégrale. Crédit/légende restent accessibles.

## 37. Forms components

Field compose label, contrôle, hint, error et compteur. Composants : text/email/tel/password, textarea, select, combobox, date/time, location picker, money, file upload, segmented control. Zod peut porter validation runtime. Ne pas cacher les erreurs dans toast uniquement.

## 38. Overlays

8 familles : Dialog, ConfirmDialog, AuthDialog, Drawer, BottomSheet, Popover, Tooltip, FullscreenViewer. Focus trap, Escape, retour focus, scroll lock, titre accessible. Un Drawer ne remplace pas une page profonde; Tooltip jamais nécessaire pour comprendre une action essentielle.

## 39. Responsive overlays

Même intention, présentation différente : Dialog Desktop → Sheet Mobile; DetailDrawer Desktop → page Mobile; FilterSidebar → Drawer/Sheet; CreatePopover → Sheet; comments panel → Sheet. La primitive `ResponsiveDialog` choisit selon capacité/largeur sans perdre état ou focus.

## 40. Data Tables

Réservées Partner/User structurés, pas Feed. Header sticky, tri annoncé, pagination, sélection optionnelle, actions accessibles. Mobile : cartes ou tableau scrollable seulement si comparaison tabulaire indispensable. Colonnes prioritaires restent visibles; pas de transformation automatique de toute table Admin.

## 41. Search

SearchField 44–48 px, label accessible, clear button, raccourci `/` Desktop hors champ. Suggestions en combobox avec clavier. Mobile sticky sous header; Desktop toolbar. Loading inline, zero results avec suggestions, query visible dans URL si partageable.

## 42. Auth visual states

États : idle, validating, submitting, challenge, invalid credentials, rate-limited, network error, success/redirect. Desktop : carte 440–520 px ou split marketing discret; Mobile : page pleine; recovery même famille. Aucun écran d’onboarding entre succès et destination.

## 43. Auth-on-action visual behavior

Action simple : dialog centré Desktop, sheet Mobile, contexte « Connectez-vous pour aimer ». Action avec état : résumé du choix avant auth et confirmation après retour. Formulaire : redirection page login avec message et `next`. Annuler revient exactement au contexte; focus retourne au déclencheur.

## 44. Dark mode

Modes light/dark/system cohérents avec Mobile. Dark utilise navy et surfaces étagées, pas noir uniforme hors média. Images conservent couleurs; overlays ajustés. Theme control dans settings/profile, sans flash via stratégie serveur/client future. Partner hérite du thème; Admin reste tel qu’il est.

## 45. Accessibility

WCAG 2.2 AA, clavier, skip link, landmarks, focus 2 px visible, touch 44 px, zoom 200 %, contraste texte 4.5:1, large 3:1, contrôles 3:1. Dialogs et tabs suivent patterns ARIA. Les cartes, menus, drag/drop et charts ont alternatives sémantiques.

## 46. Video accessibility

Autoplay muted; pause/play, mute, volume, progression, fullscreen et vitesse accessibles clavier. Sous-titres si disponibles, transcription pour contenu culturel important, `aria-label` précis. Une seule vidéo active; aucune reprise sonore automatique; reduced motion bloque autoplay optionnel.

## 47. Image accessibility

Alt décrit fonction/contenu sans répéter caption; alt vide pour décoratif. Avatars nomment la personne si nécessaire; cartes liées évitent doublon image+texte. Erreur affiche fallback stable. Artworks/culture nécessitent titre, auteur/crédit et contexte lorsque fournis.

## 48. Loading / Empty / Error

Skeleton dimensionné, spinner inline pour actions, EmptyState contextualisé, ErrorState avec retry, OfflineState et UnavailableState. Pas de skeleton infini. Feed conserve item précédent pendant pagination. Correlation ID affichable dans détail d’erreur/support. Aucun mock production.

## 49. Responsive typography

Utiliser `clamp` uniquement Display/H1/H2; body ne dépasse pas 18 px par élargissement. Longueur de ligne plafonnée. À 320 px, H1 wrap naturel sans taille <28. À 200 % zoom, aucune troncature essentielle; labels peuvent passer sur deux lignes.

## 50. Responsive spacing

Gutters : 16 mobile, 24 tablet, 32 desktop, 40 wide. Section gap : 32/48/64/64. Card gap : 12/16/20/24. Espacement ne grossit plus après 1920; les espaces externes absorbent l’ultra-wide.

## 51. Responsive media

Cards utilisent `sizes` cohérent avec colonnes. Detail galerie 100 % mobile, 60–70 % main Desktop. Feed plafonné 720. Artworks peuvent utiliser 2 colonnes mobile; événements gardent 1 pour texte. Aucun crop critique sans point focal fourni; à défaut contain/detail.

## 52. Performance media

Premier média LCP prioritaire, suivants lazy. Posters compressés, dimensions explicites, pas de preload vidéo intégral. IntersectionObserver monte/démonte lecteurs; carousels ne chargent que voisinage. Animations transform/opacity. Mapbox et fullscreen viewer importés dynamiquement.

## 53. Scroll

Document scroll par défaut. Scroll local uniquement Chat, Map split, commentaires Desktop et menus longs. Préserver position par route/URL lorsque retour. Overscroll contenu média ne doit pas bloquer navigateur. Scroll-snap proximity Feed; jamais global mandatory.

## 54. Sticky

Navigation, toolbar filtres, CTA détail et composer chat peuvent être sticky. Limiter à un sticky principal par axe; offsets utilisent hauteur shell. À zoom/viewport court, sticky devient statique pour ne pas occuper >35 % de hauteur.

## 55. Safe Area

Mobile Web utilise `env(safe-area-inset-*)` pour header, bottom nav, sheets, fullscreen et CTA. Aucun SafeAreaView React Native. Desktop ignore naturellement les insets. Le contenu interactif ne touche pas encoche/home indicator.

## 56. Dynamic viewport

Utiliser conceptuellement `dvh` pour workspaces actifs, `svh` comme minimum stable, fallback `vh`. Feed calcule espace après chrome interne; clavier détecté par visual viewport uniquement si nécessaire. Pas de hauteur 100vh rigide pour forms ou contenu long.

## 57. Responsive matrix globale

| Module | Mobile | Tablet | Desktop | Wide |
|---|---|---|---|---|
| Feed | plein média | rail+média | sidebar+média | +panel |
| Explore/Search | liste/chips | grid | filtres+grid | grid plafonnée |
| Detail | pile+CTA | 2 cols | main+aside | centré |
| Post | comments sheet | split | split | split plafonné |
| Chat | routes | 2 panels | 3 panels | centré/fluid 1680 |
| Map | toggle | split | split | max shell |
| Reading | narrow | narrow | sommaire+texte | centré |
| Forms | 1 col | 1 col | form+preview | centré |
| Partner | cards | rail | sidebar+workspace | max shell |

## 58. Wireframes ASCII

```text
MOBILE                 TABLET                    DESKTOP
┌────────────┐          ┌────┬──────────────┐    ┌────────┬──────────────┬────────┐
│ Header     │          │Rail│ Header/Main  │    │Sidebar │ Main         │Context │
├────────────┤          │    │              │    │        │              │optional│
│ Main       │          │    │              │    │        │              │        │
├────────────┤          └────┴──────────────┘    └────────┴──────────────┴────────┘
│ Bottom nav │
└────────────┘
```

## 59. Migration globals.css

1. Geler visuellement landing/Admin avec screenshots/tests.
2. Inventorier sélecteurs globaux et doublons (`--surface-warm`).
3. Créer plus tard une couche tokens `--yy-*` additive, sans renommer l’existant.
4. Déplacer progressivement styles landing vers scope Marketing.
5. Limiter globals aux reset sûr, fonts et tokens.
6. Interdire sélecteurs élémentaires destructeurs hors layer base contrôlé.
7. Retirer les anciennes variables seulement après migration complète.

## 60. Provider scoping

État actuel : QueryClient, AdminToast et Admin Session globaux dans `app/providers.tsx`. Cible : root sans provider Admin; AdminProviders dans layout Admin; PublicProviders léger; UserProviders avec session; Partner hérite User + contexte Partner. Migration en deux temps avec compatibilité : introduire wrappers équivalents, déplacer Admin sous son layout, vérifier 96 pages, puis monter public.

## 61. Admin protection

- Aucun changement involontaire `/admin/**`.
- Aucun reset/variable global renommé directement.
- `.admin-app` conserve tokens et densité.
- Aucun composant Admin remplacé automatiquement.
- Aucun import public dans Admin sans validation.
- Provider/session/toast Admin inchangés fonctionnellement.
- Dialog/table/RBAC/finance testés.
- Breakpoints Admin existants 768/1024/1280 conservés.

## 62. Partner identity

Partner montre photo/logo établissement, contexte actif, progression/KPI, tâches et revenus personnels. Plus visuel et respirant que l’Admin; tables secondaires; accent Yeyamo; langage de coaching/opération. Aucun menu de modération globale, utilisateurs plateforme, rôles Admin ou audit système.

## 63. Mobile parity rule

| Feature | Mobile référence | Web Mobile | Desktop adaptation |
|---|---|---|---|
| Nom | route/fichier prouvé | mêmes infos/actions prioritaires | composition libre documentée |
| Navigation | ordre/parcours | proche Mobile | sidebar/panels/tabs |
| États | loading/empty/error | parité obligatoire | enrichissement autorisé |
| Auth | action concernée | auth-on-action | dialog ou page |

Chaque future fiche doit certifier parité fonctionnelle, parité visuelle petit écran et liberté Desktop.

## 64. Mobile debts not to copy

Dimensions device fixes, SafeAreaView, Expo components, GestureHandlers, bottom sheets Desktop, wizards fragmentés, mocks/demo, routes mortes/aliases, onboarding, haptics, navigation bar Android, SecureStore, tab bar absolue sans gestion clavier et couleurs hardcodées répétées.

## 65. Auth surfaces

Login/Register Desktop : carte centrée 440–520 px; split seulement si contenu de marque utile et non distrayant. Mobile : page pleine. Recovery : carte simple. Auth contextuelle : Dialog Desktop, Sheet Mobile, avec raison, bénéfice et annulation. ProtectedAction visuel conserve contexte; aucune logique session implémentée ici.

## 66. Landing `/about`

Conformes : fonts, marque, rouge, grandes images, reduced motion, sections et FAQ. Trop marketing pour AppShell : hero monumental, vagues, mascotte flottante, multiples CTA et carrousels décoratifs. Réutilisables : logo, SectionHeading, FAQ pattern, assets stores. Ne pas injecter hero, vagues ou dashboard mockup dans Feed.

## 67. Semantic HTML

Une page possède un `main` et un H1. `nav` pour navigation/pagination/breadcrumb; `article` pour post, événement, culture; `section` avec heading; `aside` pour contexte complémentaire; `button` pour actions, `a` pour navigation. Cards ne deviennent pas des div cliquables. Feed est une liste d’articles.

## 68. Print/Share

Print uniquement ticket, réservation et facture/relevé Partner si contrat. Masquer navigation/actions non utiles; conserver logo, identifiant, statut, date, QR et mentions. Share utilise URL canonique; Web Share puis clipboard. Aucun print général du Feed.

## 69. Internationalisation

Layouts acceptent +30 % de longueur; boutons wrap ou s’élargissent, jamais largeur française rigide. Intl pour dates/nombres/devises; sens locale. Inputs de téléphone/adresse adaptés pays. Troncature seulement contenu secondaire avec accès au texte complet.

## 70. RTL readiness

Pas d’engagement RTL immédiat. Primitives futures utilisent inline-start/end, icônes directionnelles miroir, ordre logique DOM et propriétés CSS logiques. Éviter left/right codés dans API composant. Contenu média reste non inversé.

## 71. Iconography

Lucide unique côté Web. Tailles 16 caption, 20 standard, 24 navigation, 28–32 hero/state. Stroke 1.75–2; active peut utiliser fond/accent, pas un autre pack rempli. Icon-only a label accessible et 44 px. Icône ne remplace pas label sur action ambiguë.

## 72. Avatars

Tailles : xs 24, sm 32, md 40, lg 48, xl 64, profile 96–128. Cercle par défaut; fallback initiales déterministes; erreur revient au fallback. Badge Partner/verified uniquement si champ backend réel; ne pas inventer. Ring story est distinct du statut verified.

## 73. Badges / Chips / Tags

Badge = statut non interactif (success/warning/danger/info/neutral). Chip = filtre ou sélection légère, état pressed/selected. Tag = catégorie/contenu, lien éventuel. Hauteur 24–28 badge/tag, 32–40 chip; couleur + texte/icône, jamais couleur seule.

## 74. Density

Public comfortable : espaces 16–24, contrôles 44–52. User comfortable/standard selon tâche. Partner standard avec tables compactes 40–48 lignes. Admin existant 14 px/38 px contrôles. Aucun toggle de densité.

## 75. Responsive forms

Desktop complexes : max 1120, form 640–720 + preview 320, sections/cards, actions sticky seulement si non masquantes. Tablet : une colonne 680–760. Mobile : une colonne, padding 16, CTA bas non permanent au clavier. Conserver progression logique, pas étapes artificielles.

## 76. Upload UI

Desktop : zone drag/drop + browse, preview grille, progression par fichier, remove/retry. Mobile : browse/camera si disponible, preview scrollable. États queued/uploading/success/error. Documents Partner utilisent rows avec type, taille, statut et confidentialité, mais restent dans Partner Design.

## 77. Filters

Chips rapides : 3–6 critères fréquents. Filtres avancés : sidebar Desktop si permanents, drawer Tablet, bottom sheet Mobile. Bouton affiche nombre actif; reset global et par groupe; apply explicite Mobile, mise à jour contrôlée Desktop. État partageable dans URL.

## 78. Pagination vs Infinite

Feed : infinite. Explore éditorial : infinite avec repères et « charger plus » accessible. Search : pagination si API/page SEO, sinon infinite contrôlé. Partner tables : pagination. Collections : pagination après seuil, sinon liste. Messages : pagination inverse. Aucun pattern unique imposé.

## 79. Touch vs Hover

Hover n’expose jamais seul actions/information. Cards ont lien visible ou tap entier; tooltips ont focus/tap; menus ont bouton explicite; contrôles média apparaissent au tap et restent accessibles clavier. Active/pressed remplace hover tactile.

## 80. Keyboard

Raccourcis limités : Feed `J/K` suivant/précédent et `M` mute seulement hors champs et annoncés dans aide; Chat Enter envoyer, Shift+Enter ligne; Escape ferme overlay. `/` focus search si non conflictuel. Aucun raccourci obligatoire.

## 81. Core Web Vitals

LCP : prioriser premier média/poster, fonts locales, éviter hero produit. CLS : ratios/dimensions, skeletons, réserve nav/panels. INP : îlots clients, handlers légers, virtualisation mesurée, animations transform. Map/vidéo/charts dynamiques; panneau droit ne provoque pas reflow tardif.

## 82. Component naming

PascalCase orienté rôle : `PublicSidebar`, `MobileBottomNav`, `ContextPanel`, `FeedMedia`, `PostCommentsPanel`, `PlaceCard`, `DetailSidebar`, `ResponsiveDialog`, `PartnerDataTable`. Éviter `Box1`, `Card2`, `CustomComponent`, noms visuels sans métier.

## 83. Target folders

```text
components/
├── ui/          primitives
├── navigation/  sidebar, rail, bottom nav
├── shells/      public, auth, partner, marketing
├── overlays/    responsive dialog/sheet/drawer
├── media/       image, video, gallery
└── states/      loading, empty, error
styles/
├── tokens.css
├── themes.css
├── base.css
└── utilities.css
```

**CIBLE — NON ENCORE IMPLÉMENTÉ**; les styles Admin restent où ils sont.

## 84. Tokens vs Domain styling

Token : couleur/espace/rayon. Primitive : Button applique tokens et états. Domaine : EventCard compose primitives et ratio métier. Page : EventsPage orchestre layout. Une feature ne crée pas de rouge local; toute nouvelle valeur récurrente remonte au système après revue.

## 85. Interactive states

Chaque primitive prévoit default, hover, focus-visible, active, selected, disabled, loading, error. Selected n’est pas focus; disabled reste lisible; loading conserve dimensions; error n’utilise pas seulement rouge. Touch ne dépend pas de hover.

## 86. Dark/Light contrast

Risques : `#EF4444` avec petit texte blanc doit être mesuré; textes muted Mobile `#6B7A90` sur surfaces claires et `#8797AA` en dark; overlays alpha; rouge soft; gradients média. Landing `rgba` et Admin hex restent hors thème public. Validation colorimétrique requise Prompt 3/implémentation avant verrouillage.

## 87. Scrollbars

Scrollbar native visible sur document, tables, chat et comments. Fine/personnalisée acceptable dans rail horizontal média, panneaux et sidebar Partner, avec contraste et largeur utilisable. Ne pas masquer Desktop comme la landing le fait sur le carrousel sauf composant avec commandes alternatives.

## 88. Fullscreen

Autorisé : story, viewer média, map, scanner ticket. Vidéo Feed peut utiliser Fullscreen API à la demande; le Feed Desktop entier ne devient pas fullscreen. Escape et bouton visible sortent; orientation ne doit pas être forcée sans nécessité.

## 89. State preservation

État partageable dans URL : filters, tabs, selected map item, selected chat route. État éphémère dans composant/session : modal, draft non sensible. Au resize, ne pas remonter les features; ResponsiveDialog conserve contenu, chat sélection et filtres. Fermer seulement overlays incompatibles en restaurant focus.

## 90. Orientation

Feed portrait : média vertical; paysage : contain et chrome compact. Vidéo 16:9 exploite paysage. Map utilise plein écran. Chat masque info et garde thread. Aucun blocage portrait-only; safe areas recalculées.

## 91. Minimum viewport

Support officiel : 320 CSS px. Aucun overflow horizontal hors rails/tables explicitement scrollables. Touch targets 44; texte body ≥15; dialogs width `calc(100% - 24/32px)` ou sheet plein.

## 92. Ultra-wide strategy

Au-delà de 2560, shell reste max 1680 centré; média Feed max 720; Detail max 1280 utile; grids max 5 colonnes usuelles; Map/Chat peuvent atteindre 1680. Aucun dix-colonnes, aucune ligne de texte étirée; background/ambient art peut occuper les marges sans information essentielle.

## 93. Quality checklist

- Mobile 320/375/390, Tablet 768/1024, Desktop 1366/1440/1920, Wide 2560.
- Light/dark, loading/empty/error/offline.
- Focus, clavier, screen reader, zoom 200 %, reduced motion.
- Labels longs/i18n, image/vidéo erreur, orientation paysage.
- Visiteur, User, Partner; actions protégées.
- Pas d’overflow, sticky masquant ou hover-only.
- Admin visuellement et fonctionnellement inchangé.

## 94. Acceptance criteria

375 : aucun overflow, bottom nav/safe area corrects. 768 : rail remplace bottom nav sans perte. 1366 : main ≥560, panel supprimé si nécessaire. 1920 : espace utilisé avec panel/grille plafonnée. 2560 : shell centré, média non étiré. Zoom 200 % : ordre, actions et contenu accessibles, layouts réduits. Tous états et thèmes sont testés.

## 95. Test viewports

| Viewport | Usage |
|---|---|
| 320×568 | minimum |
| 375×667 | mobile court |
| 390×844 | mobile moderne |
| 667×375 | paysage mobile |
| 844×390 | paysage moderne |
| 768×1024 | tablet portrait |
| 1024×768 | tablet paysage |
| 1366×768 | laptop |
| 1440×900 | desktop |
| 1920×1080 | large |
| 2560×1440 | ultra-wide |

## 96. Inputs for Prompt 4

Surfaces Auth : pages full/card, AuthDialog Desktop, AuthSheet Mobile. Visiteur voit Feed/Explore; Create/Messages/Profile/actions ouvrent auth. ProtectedAction affiche la raison, conserve contexte visuel et revient au déclencheur. Simple action : dialog; stateful : résumé; formulaire : page avec retour. PublicShell reste monté derrière modal; AuthShell sert aux navigations directes; PartnerShell exige auth préalable.

## 97. Counters

| Élément | Nombre | Reproduction |
|---|---:|---|
| couleur sémantiques | 32 | section 6 |
| styles typographiques | 9 | section 7 |
| spacings non nuls | 12 | section 8 |
| radius/borders/shadows | 6/4/4 | section 9 |
| z-index | 8 | section 10 |
| motion durations | 5 | section 11 |
| breakpoints | 6 | section 12 |
| containers | 4 | section 13 |
| shells | 5 | architecture + sections 14–16 |
| layout variants | 7 | section 17 |
| nav variants | 5 | Mobile, Tablet, Desktop Public, Partner, Admin |
| context panels | 6 | suggestions, comments, CTA, chat info, booking, none |
| primitives | 28 | section 33, State compté comme famille |
| overlay types | 8 | section 38 |
| card families | 13 | section 35 |
| règles responsive majeures | 16 | sections 49–64 |

## 98. ADR Design

| ADR | Décision | Justification | Conséquence |
|---|---|---|---|
| DS-001 | bottom nav Mobile | parité Mobile | safe area/clavier requis |
| DS-002 | rail Tablet | espace disponible | fin bottom nav à 768 |
| DS-003 | sidebar Desktop | usage ordinateur | main maîtrisé |
| DS-004 | right panel optionnel | priorité contenu | disparaît avant compression |
| DS-005 | Feed média max 720 | ratio/lecture | marges/panels absorbent largeur |
| DS-006 | comments panel Desktop | continuité post | sheet Mobile |
| DS-007 | sheets surtout Mobile | ergonomie | dialogs/drawers Desktop |
| DS-008 | rouge sémantique | cohérence réelle | hardcodes migrés |
| DS-009 | dark navy | preuve Mobile | pas noir uniforme |
| DS-010 | Partner ≠ Admin | rôles distincts | shell/primitives propres |
| DS-011 | RSC composition + îlots | performance | primitives ciblées client |
| DS-012 | shell max 1680 | ultra-wide | espace externe assumé |
| DS-013 | WCAG 2.2 AA | qualité produit | focus/touch/zoom obligatoires |
| DS-014 | no mock state | dette Mobile | unavailable explicite |

## 99. Risks

| Priorité | Risque | Preuve/impact | Mitigation |
|---|---|---|---|
| P0 | contamination CSS Admin | globals volumineux | migration additive + tests visuels |
| P0 | providers Admin globaux | `app/providers.tsx` | scoping avant shell public |
| P0 | divergences de rouges/tokens | trois palettes observées | tokens sémantiques validés produit |
| P0 | contrastes non mesurés | alpha/muted/dark | audit WCAG avant implémentation |
| P1 | Feed trop lourd | vidéo/image infinies | budgets, lazy, un player actif |
| P1 | Mapbox bundle | package lourd | dynamic import |
| P1 | layouts sticky au zoom | panels/CTA | collapse à 200 % |
| P1 | Partner ressemble Admin | composants disponibles | interdiction imports Admin |
| P1 | fonts seulement 400/600 | designs Mobile 700/800 | assets ou usage limité |
| P2 | animation excessive | Framer présent/landing riche | motion tokens/reduced motion |
| P2 | ultra-wide vide | shell plafonné | contexte/ambient non essentiel |

## 100. Conclusion

Le système cible traduit le langage Mobile sans copier React Native et exploite réellement Tablet/Desktop. Il conserve le rouge et les surfaces Yeyamo, formalise une hiérarchie accessible, plafonne le Feed et les containers, différencie Public/User/Partner et protège l’Admin. Les préconditions du Prompt 4 sont claires : surfaces Auth responsive, ProtectedAction visuel, navigation visiteur et provider scoping, sans réinterprétation des shells.
