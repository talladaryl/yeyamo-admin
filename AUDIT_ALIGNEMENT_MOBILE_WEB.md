# AUDIT D’ALIGNEMENT YEYAMO MOBILE → YEYAMO WEB

> Date : 9 septembre 2026  
> Périmètre : `yeyamo-mobile/src/**` et `yeyamo-mobile/yeyamo-admin/**`  
> Méthode : inspection statique, sans exécution du backend, sans modification applicative.  
> Convention : **À VÉRIFIER** signifie que le code inspecté ne permet pas de conclure. Les chemins d’API Mobile sont relatifs à la base configurée dans `src/services/api/client.ts`; les chemins Web Admin sont préfixés par `/api/v1/` dans le proxy.

## 1. Résumé exécutif

Le dépôt contient bien deux applications : une application Expo SDK 57 très étendue et une application Next.js 15 nommée `yeyamo-admin`. L’état actuel n’est pas un Web grand public incomplet : il s’agit d’une landing à `/` et d’un produit Admin distinct sous `/admin/**`.

Constats vérifiables :

- Mobile : **174 fichiers TSX de route**, dont **166 interfaces hors layouts et 404**, **7 layouts**, **18 route groups** et 5 tabs principales.
- Web : **97 pages Next.js**, dont **96 pages Admin** et **1 page publique** (la landing).
- Couverture actuelle du Web grand public par rapport aux 166 interfaces Mobile : **0 interface équivalente complète**. Des données/domaines existent dans l’Admin, mais une interface Admin n’est pas un équivalent utilisateur.
- Le Mobile est globalement privé à cause de la garde racine de `src/app/_layout.tsx`, qui redirige tout visiteur non authentifié vers `/(auth)/login`. La cible Web doit séparer consultation publique et mutations protégées.
- Le proxy actuel `app/api/backend/[...path]/route.ts` exige le cookie Admin et n’autorise qu’une liste blanche orientée Admin. Il est réutilisable comme patron, pas comme proxy User en l’état.
- `/admin/**` peut rester dans le même repository si les futurs écrans publics utilisent un route group, des providers, cookies, styles et clients API séparés.
- Les onboarding `splash` et `step1..3` sont **MOBILE ONLY — NE PAS PORTER SUR LE WEB**.

## 2. Périmètre et méthodologie

Ont été inspectés : routes Expo Router, layouts, composants, features, hooks, stores Zustand, appels TanStack Query, client Axios, stockage sécurisé, sockets, routes Next.js, middleware, landing, composants Admin, API proxy et auth Admin. Les anciens rapports présents dans les deux projets ont servi d’index secondaire; les compteurs ont été recalculés depuis l’arborescence actuelle.

Limites : le backend n’a pas été lancé; un hook ou endpoint déclaré prouve un contrat consommé, pas la disponibilité du serveur. Les écrans purement techniques (`_layout.tsx`, `+not-found.tsx`) ne sont pas comptés comme interfaces métier.

## 3. Architecture réelle Yeyamo Mobile

- Stack racine : `src/app/_layout.tsx`; QueryClient global; hydratation auth/onboarding/thème/intérêts/pays; notifications; garde globale.
- Groups (18) : `(auth)`, `(bookings)`, `(chat)`, `(collections)`, `(create)`, `(events)`, `(experiences)`, `(explore)`, `(onboarding)`, `(partner)`, `(partner-dashboard)`, `(places)`, `(post)`, `(profile)`, `(regions)`, `(social-graph)`, `(story)`, `(tabs)`.
- Tabs : feed (`(tabs)/index`), explorer, création, chats, profil.
- État local : Zustand pour auth, onboarding, intérêts, pays, thème, création, chat, passeport, partenaire et brouillons de campagne.
- Données : Axios + TanStack Query; WebSocket/Reverb pour chat; SecureStore pour jetons.
- Présentations particulières : publication en modal, commentaires en transparent modal, story plein écran, choix de création en modal, filtres d’exploration en bottom sheets.
- Dépendances natives significatives : caméra, notifications, localisation, image picker, SecureStore, haptics, navigation bar, maps, QR et WebView.

## 4. Architecture réelle Yeyamo Web actuel

- Next.js App Router 15.4; React 19; TanStack Query; Tailwind 4; Framer Motion; Recharts; Mapbox GL.
- `/` : `app/page.tsx` rend `components/landing/landing-page.tsx`.
- `/admin/login` : auth Admin séparée.
- `/admin/**` : 96 pages, layout dédié `app/(dashboard)/admin/layout.tsx`, shell, sidebar, topbar et CSS Admin.
- Middleware : matcher limité à `/admin/:path*`; `/admin/login` exclu; redirection si absence des cookies `yeyamo_admin_access` et `yeyamo_admin_refresh`.
- Auth Admin : routes serveur `/api/auth/login|refresh|logout|session`; JWT conservés dans des cookies HttpOnly.
- Proxy : `/api/backend/[...path]`, token Admin obligatoire, allowlist explicite, corrélation et transfert du corps.
- Design réutilisable : polices, tokens publics, utilitaire `cn`, animations, composants landing. Les tables, shells et formulaires Admin ne doivent être réutilisés qu’après découplage visuel/RBAC.

## 5. Domaines fonctionnels Mobile

Auth; onboarding; intérêts; feed; posts; commentaires; stories; publicité sponsorisée; exploration; recherche; carte; régions; lieux; itinéraires; activités; événements; expériences; réservations; billetterie; paiements; culture; traditions; transmission; recettes; proverbes; langues; leçons; quiz; défis; contributions; artisans; œuvres; offres; commandes; profil; paramètres; sécurité; confidentialité; aide; support; notifications; social graph; followers; suggestions; activité; favoris; collections; passeport; badges; messagerie; création; partenaire; établissements; campagnes; promotions; finance; personnel; scans; analytics partenaire.

## 6. État actuel du Web grand public

Le Web grand public ne comporte aucune route produit. La landing ne consomme aucun feed public et les pages `/admin/events`, `/admin/places`, `/admin/culture`, etc. sont des outils de gestion, pas des interfaces de consultation. Les seuls actifs immédiatement réutilisables hors Admin sont les polices, certains tokens/animations, les images de marque et des patterns techniques (QueryClient, proxy serveur).

## 7. Matrice exhaustive Mobile → Web

Abréviations : **Pub+** = public avec actions protégées; **Priv** = privé utilisateur; **Part** = privé partenaire; **ATQ** = adapter Desktop; **PTQ** = porter telle quelle; **FW** = fusionner sur Web; **MO** = Mobile only; **NPP** = ne pas porter. `—` dans les colonnes Web signifie absence d’équivalent utilisateur. Les 166 interfaces de fichiers sont couvertes; les étapes appartenant à un même parcours sont regroupées sur une ligne et leur nombre est indiqué.

| # | Domaine | Fonctionnalité | Interface Mobile | Route Mobile | Fichier Mobile | Type d’écran | Statut Mobile | API / Hook Mobile | Endpoint détecté | Auth Mobile | Équivalent Web | Route Web | Fichier Web | Classification | Route cible | Auth Web | Adaptation Desktop | Réutilisation | Remarque |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Racine | Amorçage | Redirect | `/` | `src/app/index.tsx` | redirect | actif | onboarding store | — | non puis garde | landing seulement | `/` | `app/page.tsx` | ATQ | `/` | Pub+ | remplacer redirect par feed Web | landing partielle | Mobile redirige vers onboarding |
| 2 | Onboarding | Splash + présentation (4) | splash, step1..3 | `/splash`, `/step1..3` | `src/app/(onboarding)/*.tsx` | onboarding | actif | onboarding store | local | non | — | — | — | MO | — | — | aucun port | marque seulement | interdiction explicite |
| 3 | Auth | Choix compte | account-type | `/account-type` | `src/app/(auth)/account-type.tsx` | choix | actif | useAuth | — | non | — | — | — | FW | `/register` | public | section du formulaire | tokens visuels | fusion inscription |
| 4 | Auth | Connexion | login | `/login` | `src/app/(auth)/login.tsx` | formulaire | actif | useAuth | `POST /auth/login`, OAuth | non | admin seulement | `/admin/login` | auth admin | ATQ | `/login` | public | modal/page avec retour | pattern serveur | ne pas partager session Admin |
| 5 | Auth | Inscription | register | `/register` | `src/app/(auth)/register.tsx` | formulaire | actif | useAuth/useCountry | `POST /auth/register` | non | — | — | — | ATQ | `/register` | public | formulaire responsive | schémas à adapter | Turnstile requis |
| 6 | Auth | Partner aliases (2) | redirects | `/register-partner*` | `src/app/(auth)/register-partner*.tsx` | redirect | dupliqué | Redirect | — | non | — | — | — | NPP | `/register?type=partner` | public | aucune | — | routes fantômes |
| 7 | Auth | Mot de passe oublié | forgot-password | `/forgot-password` | `src/app/(auth)/forgot-password.tsx` | formulaire | actif | useAuth | `POST /auth/password/forgot` | non | — | — | — | PTQ | `/forgot-password` | public | carte centrée | contrat API | — |
| 8 | Auth | Vérification code | verify-code | `/verify-code` | `src/app/(auth)/verify-code.tsx` | formulaire | actif | useAuth | verification request/confirm | non | — | — | — | FW | `/verify-email` | public | intégrer au funnel | contrat API | retour contexte |
| 9 | Auth | Reset password | reset-password | `/reset-password` | `src/app/(auth)/reset-password.tsx` | formulaire | actif | useAuth | `POST /auth/password/reset` | non | — | — | — | FW | `/reset-password` | public | funnel unifié | contrat API | — |
| 10 | Préférences | Intérêts | interests | `/interests` | `src/app/interests.tsx` | sélection | actif | interests store | local | oui | — | — | — | ATQ | `/settings/interests` | Priv | grille multi-colonnes | logique locale | ne pas bloquer arrivée Web |
| 11 | Feed | Feed vertical | tab feed | `/(tabs)` | `src/app/(tabs)/index.tsx` | liste | actif | useFeed/useAds | `GET /feed`, `/feed/sponsored` | oui | — | `/` landing | `app/page.tsx` | ATQ | `/` | Pub+ | 3 colonnes possibles | contrats feed | cible accueil |
| 12 | Posts | Détail publication | post modal | `/[id]` | `src/app/(post)/[id].tsx` | modal détail | actif | usePost | `/posts/{id}`, summary | oui | — | — | — | ATQ | `/posts/[id]` | Pub+ | post + commentaires | API Mobile | URL partageable |
| 13 | Posts | Commentaires | comments modal | `/[id]/comments` | `src/app/(post)/[id]/comments.tsx` | modal | actif | usePost | comments, comment create | oui | — | — | — | FW | `/posts/[id]` | Pub+ | panneau latéral | API Mobile | fusion détail post |
| 14 | Posts | Créer publication | publication | `/publication` | `src/app/(create)/publication.tsx` | formulaire | actif | create store/post API | `/media`, `/posts`, publish | oui | — | — | — | ATQ | `/create/post` | Priv | composer modal/page | contrats | upload Web |
| 15 | Posts | Supprimer | action détail | `/[id]` | `src/app/(post)/[id].tsx` | action | actif | postApi | `DELETE /posts/{id}` | oui | — | — | — | PTQ | même page | Priv | confirmation | contrat | — |
| 16 | Stories | Liste/lecture | stories + viewer | `/stories`, `/(story)/[id]` | explore/story files | liste + fullscreen | actif/mixte | useStory | `GET /stories/{id}`, view | oui | — | — | — | ATQ | `/stories/[id]` | Pub+ | viewer centré | API | création protégée |
| 17 | Stories | Créer story | story | `/story` | `src/app/(create)/story.tsx` | fullscreen | actif | postApi | `POST /stories` | oui | — | — | — | ATQ | `/create/story` | Priv | composer | API média | caméra facultative |
| 18 | Explorer | Hub | explore tab | `/explore` | `src/app/(tabs)/explore.tsx` | hub | actif | useExplore/discovery | trending/categories | oui | — | — | — | ATQ | `/explore` | public | sidebar + grille | Mapbox/tokens | — |
| 19 | Recherche | Recherche globale | search | `/search` | `src/app/(explore)/search.tsx` | recherche | actif | discovery hooks | `GET /discovery/search` | oui | Admin search seulement | `/admin/search-discovery` | admin | ATQ | `/search` | public | résultats multi-colonnes | endpoint Mobile | Admin non équivalent |
| 20 | Carte | Carte découverte | map | `/map` | `src/app/(explore)/map.tsx` | carte | actif | useMaps/useLocation | geocode/nearby | oui | Mapbox présent | admin places | composants admin | ATQ | `/map` | public | carte + panneau | `mapbox-gl` | permissions progressives |
| 21 | Régions | Détail région | region | `/[id]` | `src/app/(regions)/[id].tsx` | détail | orphelin | explore | `/regions` | oui | gestion Admin | `/admin/regions` | admin | NPP | `/regions/[id]` à réévaluer | public | — | données admin | aucune navigation détectée |
| 22 | Lieux | Liste | places | `/places` | `src/app/(explore)/places.tsx` | liste | actif | usePlaces | discovery/nearby | oui | gestion Admin | `/admin/places` | admin | ATQ | `/places` | public | filtres + grille/carte | contrats + Mapbox | — |
| 23 | Lieux | Détail | place detail | `/[id]` | `src/app/(places)/[id].tsx` | détail | actif | usePlaces | `GET /places/{id}` | oui | détail Admin | `/admin/places/[id]` | admin | ATQ | `/places/[id]` | Pub+ | contenu + CTA sticky | données/type partiels | avis/favoris protégés |
| 24 | Lieux | Itinéraire | route | `/route/[id]` | `src/app/(places)/route/[id].tsx` | carte native | actif | mapsApi | `/maps/route`, directions | oui | Mapbox présent | — | — | ATQ | `/places/[id]/directions` | public | carte Web | Mapbox | géolocalisation navigateur |
| 25 | Lieux | Suggestion (2) | step1..2 | `/suggest-place-step*` | `src/app/(create)/suggest-place-step*.tsx` | wizard | partiel/mock | create store | aucun submit prouvé | oui | création Admin | `/admin/places/new` | admin | FW | `/places/suggest` | Priv | formulaire sections | picker Admin partiel | backend bloquant |
| 26 | Événements | Liste | events | `/events` | `src/app/(explore)/events.tsx` | liste | actif | useEvents | `GET /events/upcoming` | oui | gestion Admin | `/admin/events` | admin | ATQ | `/events` | public | grille/calendrier léger | contrats/types | — |
| 27 | Événements | Détail | event detail | `/[id]` | `src/app/(events)/[id].tsx` | détail | actif | useEventDetail | `GET /events/{id}` | oui | détail Admin | `/admin/events/[id]` | admin | ATQ | `/events/[id]` | Pub+ | contenu + billetterie sticky | types partiels | — |
| 28 | Événements | Inscription | booking event | `/event/[id]` | `src/app/(bookings)/event/[id].tsx` | transaction | actif | registration | register/unregister | oui | Admin réservations | — | admin | FW | `/events/[id]` | Priv action | CTA intégré | API | retour après login |
| 29 | Billetterie | Types + checkout (2) | tickets/checkout | `/[id]/tickets`, `/checkout` | `src/app/(events)/[id]/*` | funnel | orphelin | useTicketing | hold, orders, types | oui | Admin ticketing | — | admin | NPP | `/events/[id]/tickets` à reconstruire | Priv | panneau/checkout | contrats | routes orphelines actuelles |
| 30 | Événements | Créer event + settings (2) | event/settings | `/event*` | `src/app/(create)/event*.tsx` | wizard | actif/mock | create store/eventsApi | `POST /events` | oui | création Admin | `/admin/events/new` | admin | FW | `/create/event` | Priv | sections | formulaire Admin non partageable tel quel | settings mock |
| 31 | Expériences | Liste | experiences | `/experiences` | `src/app/(explore)/experiences.tsx` | liste | actif | experiences hooks | catalogue | oui | catalogue Admin | `/admin/catalog` | admin | ATQ | `/experiences` | public | grille | catalog types partiels | — |
| 32 | Expériences | Détail | experience | `/[id]` | `src/app/(experiences)/[id].tsx` | détail | actif | experiencesApi | `/catalog/assets/{id}` | oui | asset Admin | `/admin/catalog/[id]` | admin | ATQ | `/experiences/[id]` | Pub+ | contenu + CTA sticky | endpoint | — |
| 33 | Expériences | Réserver | booking | `/experience/[id]` | `src/app/(bookings)/experience/[id].tsx` | transaction | actif | booking hooks | `/bookings` | oui | réservations Admin | — | admin | FW | `/experiences/[id]` | Priv action | CTA intégré | contrats | — |
| 34 | Activités | Réserver activité | booking | `/activity/[id]` | `src/app/(bookings)/activity/[id].tsx` | transaction | actif | place activities | `/activities`, `/bookings` | oui | — | — | — | ATQ | `/activities/[id]` | Pub+ | détail + booking | API | — |
| 35 | Culture | Hub | culture | `/culture` | `src/app/(explore)/culture.tsx` | hub | actif | culture hooks | daily/trending/categories | oui | gestion Admin | `/admin/culture` | admin | ATQ | `/culture` | public | éditorial/grille | contrats | — |
| 36 | Culture | Détail contenu | culture id | `/culture/[id]` | `src/app/(explore)/culture/[id].tsx` | détail | actif | culture hooks | contents/translations | oui | asset Admin | — | admin | ATQ | `/culture/[id]` | Pub+ | lecture riche | API | interactions protégées |
| 37 | Culture | Traditions | liste | `/traditions` | `src/app/(explore)/traditions.tsx` | catalogue | actif/demo possible | culture | contents filtrés | oui | gestion Admin | — | admin | ATQ | `/culture/traditions` | public | grille | API culture | — |
| 38 | Culture | Transmission | éditorial | `/transmission` | `src/app/(explore)/transmission.tsx` | contenu | actif | culture | **À VÉRIFIER** | oui | — | — | — | ATQ | `/culture/transmission` | public | article/hub | assets landing | vérifier backend |
| 39 | Culture | Proverbes liste+détail (2) | proverbs | `/proverbs`, `/proverbs/[id]` | explore proverbs | liste/détail | actif | culture | contents filtrés | oui | — | — | — | ATQ | `/culture/proverbs[/id]` | public | master/detail possible | API culture | — |
| 40 | Culture | Recettes liste+détail (2) | recipes | `/recipes`, `/recipes/[id]` | explore recipes | liste/détail | actif | culture | contents filtrés | oui | — | — | — | ATQ | `/culture/recipes[/id]` | public | grille/détail | API culture | — |
| 41 | Langues | Liste + langue (2) | languages | `/languages`, `/[code]` | explore languages | liste/détail | actif | culture hooks | `/culture/languages/**` | oui | — | — | — | ATQ | `/languages[/code]` | public | navigation secondaire | API | — |
| 42 | Langues | Leçons liste+détail (2) | lessons | `/[code]/lessons`, `/language-lessons/[id]` | language files | apprentissage | actif | culture hooks | lessons/detail/start | oui | — | — | — | ATQ | `/languages/[code]/lessons/[id]` | Pub+ | cours large | API/audio | démarrage protégé |
| 43 | Langues | Quiz + résultat (2) | quiz/result | `/quiz`, `/result` | lesson nested files | exercice | actif | culture hooks | attempts/complete | oui | — | — | — | FW | `/languages/[code]/lessons/[id]` | Priv action | panneau exercice | API | progression privée |
| 44 | Langues | Progression | language-progress | `/language-progress` | `src/app/(profile)/language-progress.tsx` | tableau | actif | culture progress | `/culture/language-progress/me` | oui | — | — | — | ATQ | `/profile/languages` | Priv | dashboard | API | — |
| 45 | Défis | Liste+détail (2) | challenges | `/challenges[/id]` | explore challenges | liste/détail | actif | culture hooks | challenges | oui | Admin gamification | `/admin/gamification` | admin | ATQ | `/challenges[/id]` | Pub+ | grille/détail | missions UI concept | join protégé |
| 46 | Défis | Mes défis | culture-challenges | `/culture-challenges` | profile | liste | actif | culture hooks | `/culture/challenges/me` | oui | — | — | — | PTQ | `/profile/challenges` | Priv | cartes | API | — |
| 47 | Culture | Contribution | create contribution | `/culture-contribution` | create | formulaire | actif | cultureApi | contributions create/update/submit | oui | catalogue Admin | — | admin | ATQ | `/contribute/culture` | Priv | formulaire sections | schémas | modération requise |
| 48 | Culture | Mes contributions | profile | `/culture-contributions` | profile | liste | actif | cultureApi | `/culture/contributions/me` | oui | — | — | — | PTQ | `/profile/contributions` | Priv | table/cartes | API | — |
| 49 | Artisans | Liste+détail (2) | artisans | `/artisans[/id]` | explore artisans | liste/détail | actif | artisans hooks | `/artisans/**` | oui | partners Admin | `/admin/partners` | admin | ATQ | `/artisans[/id]` | Pub+ | grille/profil | types partiels | follow protégé |
| 50 | Artisan | Devenir artisan (6) | main + 5 aliases | `/become-artisan/**` | profile artisan files | wizard/aliases | partiel/dupliqué | partner/artisan APIs | partner/artisan profile | oui | partner review Admin | — | admin | FW | `/partner/apply` | Priv | formulaire sections | contrats KYC | aliases NPP dans implémentation |
| 51 | Artisan | Artisans suivis | followed-artisans | `/followed-artisans` | profile | liste | actif | social | following | oui | — | — | — | PTQ | `/profile/artisans` | Priv | grille | API social | — |
| 52 | Œuvres | Liste+détail (2) | artworks | `/artworks[/id]` | explore artworks | liste/détail | actif | artworks hooks | `/artworks/**` | oui | catalogue Admin | `/admin/catalog` | admin | ATQ | `/artworks[/id]` | Pub+ | galerie/commerce | API | — |
| 53 | Œuvres | Création (7) | artwork wizard | `/artwork/*` | create artwork | wizard | actif | create store/artworks | `POST /artworks`, media | oui | catalogue Admin | `/admin/catalog/new` | admin | FW | `/artworks/new` | Priv/Part | formulaire sections | schémas/API | image picker Web |
| 54 | Œuvres | Œuvres enregistrées | saved-artworks | `/saved-artworks` | profile | grille | actif | interactions/profile | **À VÉRIFIER** | oui | — | — | — | PTQ | `/profile/saved-artworks` | Priv | grille | ArtworkCard concept | endpoint exact à vérifier |
| 55 | Œuvres | Commandes client liste+détail (3) | orders | `/artwork-orders[/id]` | profile files | liste/détail | actif | artwork-orders | `/artwork-orders/**` | oui | commerce Admin | — | admin | ATQ | `/orders/artworks[/id]` | Priv | table/détail | contrats | — |
| 56 | Profil | Profil connecté | tab profile | `/profile` | `src/app/(tabs)/profile.tsx` | dashboard | actif | useProfile | users/me/stats | oui | user Admin seulement | — | admin | ATQ | `/profile` | Priv | header + tabs | types partiels | — |
| 57 | Profil | Profil public | username | `/[username]` | `src/app/(profile)/[username].tsx` | profil | actif | profile/social | social profile | oui | user détail Admin | `/admin/users/[id]` | admin | ATQ | `/@/[username]` | Pub+ | profil + contenu | types partiels | convention évite collision |
| 58 | Profil | Éditer profil | edit-profile | `/edit-profile` | profile | formulaire | actif | settingsApi | `PUT /users/me` | oui | — | — | — | ATQ | `/settings/profile` | Priv | sections | API | — |
| 59 | Profil | Publications/événements | 2 listes | `/publications`, `/events` | profile files | listes | actif | profileApi | `/posts/me`, `/events/me` | oui | Admin équivalents | — | admin | FW | `/profile?tab=content` | Priv | tabs | APIs | fusion profil |
| 60 | Profil | Réservations | reservations | `/reservations` | profile | liste | actif | profileApi | `/bookings/me` | oui | Admin gestion | `/admin/reservations` | admin | ATQ | `/reservations` | Priv | table/cartes | contrats | — |
| 61 | Profil | Avis | reviews | `/reviews` | profile | liste | actif | profile | **À VÉRIFIER** | oui | Admin reviews | `/admin/reviews` | admin | PTQ | `/profile/reviews` | Priv | liste | composant review concept | backend exact |
| 62 | Profil | Favoris | favorites | `/favorites` | profile | liste | actif | feed/interactions | favorite endpoints | oui | — | — | — | ATQ | `/favorites` | Priv | grille filtrable | API | — |
| 63 | Profil | Activité | activity | `/activity` | profile | timeline | actif | social | `/users/social/activity` | oui | analytics Admin | — | admin | ATQ | `/profile/activity` | Priv | timeline | API | — |
| 64 | Social | Followers/following (2) | listes | `/followers`, `/following` | profile | listes | actif | socialApi | social followers/following | oui | — | — | — | ATQ | `/@/[username]/connections` | Pub+ | tabs | API | follow protégé |
| 65 | Social | Recherche/suggestions/amis (3) | search/suggestions/find | routes profile | 3 listes | actif | socialApi | search/suggestions | oui | — | — | — | FW | `/people` | Pub+ | recherche + suggestions | API | contacts natifs non requis |
| 66 | Social | Paramètres sociaux | social-settings | `/social-settings` | profile | formulaire | actif | socialApi | `/users/social/settings` | oui | — | — | — | PTQ | `/settings/social` | Priv | formulaire | API | — |
| 67 | Collections | Liste+détail+création (3) | collections | `/collections/**` | collection files | liste/détail/form | actif | collections hooks | `/collections/**` | oui | Admin CRUD | `/admin/collections` | admin | ATQ | `/collections[/id]` | Priv/public selon visibilité | sidebar/grille | API/types partiels | — |
| 68 | Collections | Ajouter à collection | add | `/add-to-collection` | collection file | action page | orphelin | mutation collection | `/collections/places` | oui | — | — | — | FW | modal contextuelle | Priv | modal | API | ne pas porter comme route |
| 69 | Passeport | Passeport + section (2) | passport | `/passport[/section]` | social-graph | dashboard | actif/mock mixte | passport store | local/mock | oui | — | — | — | ATQ | `/passport` | Priv | dashboard | logique locale | backend incomplet |
| 70 | Badges | Liste+détail (2) | badges | `/badges[/id]` | social-graph | liste/détail | actif | useBadges | `/me/badges`, `/me/xp` | oui | Admin badges bloqué | `/admin/gamification/badges` | admin | ATQ | `/badges[/id]` | Pub+/Priv progrès | galerie | API partielle | — |
| 71 | Notifications | Centre | notifications | `/notifications` | profile | liste | actif | notifications hooks | `/notifications/**` | oui | Admin notifications | `/admin/notifications` | admin | ATQ | `/notifications` | Priv | panneau/page | API | push devient web push optionnel |
| 72 | Chat | Boîte de réception | chats tab | `/chats` | `src/app/(tabs)/chats.tsx` | liste | actif | useConversations | messaging | oui | support Admin seulement | `/admin/messages` | admin | ATQ | `/messages` | Priv | liste + conversation | Query pattern | — |
| 73 | Chat | Conversation | chat id | `/[id]` | `src/app/(chat)/[id].tsx` | temps réel | actif | chat socket/hooks | messages/send/read | oui | — | — | — | ATQ | `/messages/[id]` | Priv | 2/3 panneaux | socket contract | — |
| 74 | Chat | Nouveau message | new | `/new` | chat | formulaire | actif | chat/social | create conversation | oui | — | — | — | FW | `/messages` | Priv | modal/panneau | API | — |
| 75 | Chat | Info conversation | info | `/info/[id]` | chat | détail | actif | useChat | conversation | oui | — | — | — | FW | `/messages/[id]` | Priv | panneau droit | API | — |
| 76 | Chat | Outils conversation | tools | `/tools/[section]` | chat | sous-écran | actif | chat hooks | messages filtres | oui | — | — | — | FW | `/messages/[id]` | Priv | tabs/panneau | API | — |
| 77 | Paramètres | Préférences/settings (3) | settings/preferences/privacy | profile files | formulaires | actif | settings/country/theme | users/me/preferences | oui | settings Admin distinct | — | admin | FW | `/settings` | Priv | sections/tabs | form patterns | — |
| 78 | Paramètres | Sécurité | security | `/security` | profile | formulaire | actif | authApi | `PUT /auth/password` | oui | sécurité Admin | `/admin/settings/security` | admin | PTQ | `/settings/security` | Priv | carte | contrat | cookies User séparés |
| 79 | Paramètres | Suppression compte | delete-account | `/delete-account` | profile | confirmation | actif | settingsApi | `DELETE /users/me` | oui | — | — | — | PTQ | `/settings/account` | Priv | danger zone | API | réauth recommandée |
| 80 | Support | aide/FAQ/support/about/privacy (5) | pages support | routes profile | contenus | actif/statique | local | — | oui | landing FAQ | `/` | landing components | FW | `/help`, `/about`, `/privacy` | public/Priv ticket | pages éditoriales | landing FAQ/footer | déplacer contenu utile |
| 81 | Tickets | Mes tickets+détail (2) | tickets | `/tickets[/id]` | profile files | liste/détail | actif | ticketing | `/tickets/my-tickets`, qr | oui | Admin tickets partiel | — | admin | ATQ | `/tickets[/id]` | Priv | liste + billet | API | QR affichage Web |
| 82 | Création | Menu de création | choice/tab create | `/choice`, tab | create files | modal/interception | actif | auth/create | — | oui | — | — | — | FW | bouton global | Priv | modal desktop | — | pas une page autonome |
| 83 | Partenaire | Choix + publication/story/offre (4) | partner create | routes partner | formulaires | actif/mixte | partner/create/artworks | posts/stories/offers | oui partenaire | Admin partenaires | — | admin | FW | `/partner/create` | Part | hub + formulaires | APIs | — |
| 84 | Partenaire | Ajout lieu (4) | step1..4 | `/add-place-step*` | partner files | wizard | actif | partner/create | `POST /places` | oui partenaire | Admin place create | `/admin/places/new` | admin | FW | `/partner/places/new` | Part | formulaire sections | schémas partiels | — |
| 85 | Partenaire | Ajout événement (4) | step1..4 | `/add-event-step*` | partner files | wizard | actif | events/create | `POST /events` | oui partenaire | Admin event create | `/admin/events/new` | admin | FW | `/partner/events/new` | Part | wizard court/sections | contrat | — |
| 86 | Partner | Dashboard + statistiques (3) | dashboard/statistics/artisan stats | partner-dashboard | dashboards | actif/partiel | partner analytics | `/analytics/partners/{id}/dashboard` | partenaire | Admin analytics partner | `/admin/analytics/partners` | admin | ATQ | `/partner/dashboard` | Part | sidebar + KPI/charts | Recharts/patterns | RBAC distinct |
| 87 | Partner | Établissements | establishments | `/establishments` | partner-dashboard | liste | actif | places/partner | `/places/me` | partenaire | Admin places | — | admin | ATQ | `/partner/places` | Part | table/grille | types | — |
| 88 | Partner | Événements | events | `/events` | partner-dashboard | liste | actif | events | `/events/me` | partenaire | Admin events | — | admin | ATQ | `/partner/events` | Part | table/calendrier | types | — |
| 89 | Partner | Réservations | reservations | `/reservations` | partner-dashboard | liste | actif | partner dashboard | **À VÉRIFIER** | partenaire | Admin reservations | `/admin/reservations` | admin | ATQ | `/partner/reservations` | Part | table | composant concept | endpoint exact |
| 90 | Partner | Avis | reviews | `/reviews` | partner-dashboard | liste | actif/partiel | partner dashboard | **À VÉRIFIER** | partenaire | Admin reviews bloqué | `/admin/reviews` | admin | ATQ | `/partner/reviews` | Part | table + détail | review cards | backend à confirmer |
| 91 | Partner | Campagnes (3) | list/create/detail | campaign routes | gestion | actif | campaigns hooks | `/campaigns/**` | partenaire | Admin campaigns | `/admin/campaigns` | admin | ATQ | `/partner/campaigns[/id]` | Part | table/editor | schémas/API | — |
| 92 | Partner | Promotions (2) | list/create | promotion routes | gestion | actif | promotions | partner promotion base | partenaire | Admin promotions | `/admin/promotions` | admin | ATQ | `/partner/promotions` | Part | table/editor | schémas/API | vérifier base selon partnerId |
| 93 | Partner | Finance + transaction (2) | finance/detail | finance routes | dashboard | actif | finance hooks | partner finance summary/transactions | partenaire | Admin finance | `/admin/ledger`, payments | admin | ATQ | `/partner/finance[/id]` | Part | KPI + table | Recharts/types | — |
| 94 | Partner | Billetterie types/création/commandes (3) | ticket routes | event nested | gestion | actif/partiel | ticketing | partner ticket endpoints | partenaire | Admin ticketing partiel | event admin | admin | ATQ | `/partner/events/[id]/tickets` | Part | tabs/table | contrats | orders partiel à vérifier |
| 95 | Partner | Scan tickets | ticket-scans | `/event/[id]/ticket-scans` | partner-dashboard | scanner | actif/native | ticketing/camera | `POST /tickets/scan` | partenaire | Admin scans | event admin | admin | ATQ | `/partner/events/[id]/scan` | Part | caméra navigateur + saisie | API | permission caméra |
| 96 | Partner | Staff | staff | `/event/[id]/staff` | partner-dashboard | gestion | actif | partner-staff | invitations/assignments | partenaire | Admin RBAC distinct | — | admin | ATQ | `/partner/events/[id]/staff` | Part | table/dialog | API | rôles métier séparés |
| 97 | Partner | Analytics event | analytics | `/event/[id]/analytics` | partner-dashboard | dashboard | partiel | ticketing metrics | métriques ticketing | partenaire | Admin analytics events | `/admin/analytics/events` | admin | ATQ | `/partner/events/[id]/analytics` | Part | charts | Recharts + API | maturité à confirmer |
| 98 | Partner | Œuvres + détail (2) | artworks | `/artworks[/id]` | partner-dashboard | gestion | actif | artworks | artisan artworks | partenaire | Admin catalog | — | admin | ATQ | `/partner/artworks[/id]` | Part | table/editor | API | — |
| 99 | Partner | Commandes œuvres + détail (2) | orders | `/artwork-orders[/id]` | partner-dashboard | gestion | actif | artwork-orders | `/artisan/orders/**` | partenaire | commerce Admin | — | admin | ATQ | `/partner/orders[/id]` | Part | table/détail | API | — |
| 100 | Partner | Profil artisan | artisan-profile | `/artisan-profile` | partner-dashboard | formulaire | actif | artisansApi | `/partners/me/artisan-profile` | partenaire | partner Admin | `/admin/partners/[id]` | admin | ATQ | `/partner/profile` | Part | sections | API | — |
| 101 | Partner | Notifications/settings (2) | pages | partner-dashboard | paramètres | actif | notifications/partner | notifications/users | partenaire | Admin distinct | — | admin | FW | `/partner/settings` | Part | sections | patterns | — |
| 102 | Partner | Offre | offer | `/offer` | `src/app/(partner)/offer.tsx` | formulaire | actif/partiel | artworks offer | `/artwork-offers` | partenaire | promotions Admin non équiv. | — | admin | ATQ | `/partner/offers/new` | Part | formulaire | API | — |
| 103 | Profil | Suggestions | suggestions | `/suggestions` | profile | liste | actif | recommendations | `/recommendations` | oui | — | — | — | FW | `/explore` | Pub+ | panneau recommandations | API | fusion découverte |

## 8. Interfaces à porter telles quelles

Logique directement transposable : récupération/reset de mot de passe, mes défis, contributions, artisans suivis, œuvres sauvegardées, avis personnels, paramètres sociaux, changement de mot de passe, suppression du compte. « Telle quelle » vise la logique et les états, jamais les composants React Native.

## 9. Interfaces à adapter Desktop

Feed, post, stories, explorer, recherche, carte, lieux, événements, expériences, culture, langues, profils, collections, passeport, badges, chat, tickets et tout le dashboard partenaire nécessitent une composition Desktop dédiée.

## 10. Interfaces à fusionner

Les commentaires fusionnent avec le détail post; les actions booking avec les détails event/experience; les écrans chat info/outils/nouveau avec le workspace messages; les formulaires artwork, lieu, événement, artisan et auth deviennent des pages à sections ou des wizards Web courts; les sous-pages profil deviennent des tabs ou settings.

## 11. Interfaces Mobile-only

`(onboarding)/splash.tsx`, `step1.tsx`, `step2.tsx`, `step3.tsx`. Le scan QR n’est pas Mobile-only : `MediaDevices.getUserMedia` permet une version Web, avec fallback de saisie.

## 12. Interfaces à ne pas porter

- Les deux aliases `register-partner*`.
- Les cinq sous-routes `become-artisan/*` lorsqu’elles ne sont que des re-exports du formulaire monolithique.
- `collections/add-to-collection` comme page autonome : convertir en modal contextuelle.
- Les routes orphelines actuelles event tickets/checkout : reconstruire le parcours à partir des contrats, sans copier leur navigation morte.
- La route région orpheline tant qu’aucune référence de navigation n’est rétablie.
- Tous mocks/demo et composants remplacés identifiés dans `mockData.ts`, `*.demo.ts` ou sans mutation persistante.

## 13. Interfaces déjà présentes Web

Aucune interface utilisateur Mobile n’est suffisamment équivalente sur le Web. La landing est une interface Web additionnelle. Les interfaces Admin homologues (lieux, événements, partenaires, réservations, catalogue, culture, campagnes, finance) prouvent seulement la disponibilité de composants/types ou de contrats administratifs.

## 14. Routes Web cibles

```text
PUBLIC: /, /explore, /search, /map, /posts/[id], /stories/[id]
        /places, /places/[id], /events, /events/[id]
        /experiences, /experiences/[id], /activities/[id]
        /culture/**, /languages/**, /challenges/**
        /artisans/**, /artworks/**, /@/[username]
AUTH:   /login, /register, /forgot-password, /reset-password, /verify-email
USER:   /messages/**, /profile, /settings/**, /favorites, /collections/**
        /reservations, /tickets/**, /orders/**, /passport, /badges/**
CREATE: /create/post, /create/story, /create/event, /places/suggest
        /contribute/culture, /artworks/new
PARTNER:/partner/dashboard, /partner/places/**, /partner/events/**
        /partner/reservations, /partner/reviews, /partner/campaigns/**
        /partner/promotions, /partner/finance/**, /partner/artworks/**
        /partner/orders/**, /partner/profile, /partner/settings
ADMIN:  /admin/** (existant, inchangé)
MARKETING: /about (landing actuelle déplacée)
```

`/@/[username]` évite qu’un username entre en collision avec les routes racines. `/about` est retenu pour la landing car son contenu est institutionnel/marketing; les cartes destinations peuvent alimenter `/explore` et la FAQ `/help`.

## 15. Matrice Public / Auth / Partner / Admin

| Fonctionnalité | Consultation publique | Action protégée | Auth utilisateur | Auth partenaire | Admin |
|---|:---:|---|:---:|:---:|:---:|
| Feed, posts, stories | oui | like, commentaire, favori, création | action | non | modération |
| Profils, artisans, œuvres | oui | follow, favori, offre/commande | action | vente | gestion |
| Explorer, recherche, carte | oui | sauvegarde, collection | action | non | configuration |
| Lieux/activités | oui | avis, réservation, suggestion | action | gestion | gestion |
| Événements/expériences | oui | inscription, booking, ticket | action | gestion | gestion |
| Culture/langues/défis | oui | progression, join, contribution | action | non | gestion |
| Messages/notifications | non | toutes | oui | oui | support séparé |
| Profil/settings/passeport | non, sauf profil public | toutes | oui | selon rôle | non |
| Partner dashboard | non | toutes | non | oui | supervision |
| Admin | non | toutes | non | non | oui |

## 16. Actions déclenchant authentification

| Action | Écran Mobile | Hook/service | Endpoint observé | Mobile | Web recommandé |
|---|---|---|---|---|---|
| Like/unlike | feed/post | feedApi | `PUT/DELETE /interactions/posts/{id}/like` | session préalable | ouvrir login, retour URL, rejouer intention |
| Favori | feed/place/event/artwork | feed/generic interactions | interaction favorite | session préalable | même mécanisme |
| Commenter/répondre | post/culture | feed/generic hooks | comments/COMMENT | session préalable | login puis restaurer brouillon |
| Follow | profil/artisan | socialApi | social follow | session préalable | login puis retour profil |
| Collections | lieux/collections | collections hooks | `/collections/**` | privé | login puis rouvrir modal |
| Réserver | activité/expérience | booking hooks | `POST /bookings` | privé | login, retour détail, conserver choix |
| S’inscrire événement | event booking | eventsApi | `/events/{id}/register` | privé | login puis retour event |
| Acheter billet | ticketing | ticketing hooks | hold/orders | privé | login avant création du hold |
| Commander œuvre | artwork order | artwork hooks | `POST /artwork-orders` | privé | login puis retour œuvre |
| Envoyer message | chat | chatApi | messaging conversations/messages | privé | login puis ouvrir conversation |
| Créer contenu | create | post/events/culture/artworks | endpoints create | privé | login puis formulaire |
| Modifier profil/settings | profile | settingsApi | `/users/me/**` | privé | route privée |
| Défi/leçon/progression | culture | cultureApi | join/start/attempt/complete | privé | lecture publique, mutation après login |
| Partner actions | partner | partner APIs | partner-scoped endpoints | partenaire | login + contrôle rôle serveur |

Le retour doit utiliser un paramètre `next` validé contre une URL interne; ne jamais accepter une URL absolue afin d’éviter les open redirects.

## 17. Parcours multi-écrans à fusionner

| Parcours Mobile | Nombre d’écrans | Proposition Web | Justification |
|---|---:|---|---|
| Artwork | 7 | page à sections + aperçu sticky | données fortement liées |
| Partner add place | 4 | formulaire sectionné | desktop réduit la fragmentation |
| Partner add event | 4 | wizard 2 étapes ou sections | billetterie conditionnelle |
| Suggest place | 2 | une page | faible volume |
| Become artisan | 6 fichiers | une candidature à sections | 5 aliases/re-exports |
| Event create/settings | 2 | une page avec section visibilité | settings seul est mock |
| Post + comments | 2 | centre + panneau latéral | contexte continu |
| Chat list/detail/info/tools | 5 familles | workspace 2–3 panneaux | usage desktop standard |
| Language lesson/quiz/result | 3 | lecteur + panneau d’exercice | continuité pédagogique |
| Ticket types/checkout | 2 | détail + drawer/checkout | conserver contexte événement |

## 18. Recommandations responsive Desktop

- Feed : navigation gauche, colonne centrale, panneau recommandations/tendances à droite.
- Post : publication centrale et commentaires persistants à droite.
- Explorer : filtres latéraux, grille fluide, bascule liste/carte.
- Place/event/experience/artwork : contenu principal et CTA transactionnel sticky.
- Chat : conversations, thread, informations/outils.
- Profil : header large, tabs, grille de médias et rail contextuel.
- Culture/langues : navigation secondaire, contenu éditorial, progression visible si connecté.
- Partner : sidebar métier, KPI, tables et charts; réutiliser Recharts mais pas le shell Admin.

## 19. Analyse du Feed comme `/`

`app/page.tsx` doit à terme rendre le feed public, sans passer par le middleware Admin. La landing doit être déplacée vers `/about`. Aucun middleware actuel ne cible `/`, donc le changement est local au routage public. Il faut un client public ou un rendu serveur pour `GET /feed`, et un garde d’action côté client pour les mutations. `/admin/**` reste derrière son matcher actuel. Les composants React Native du feed ne sont pas réutilisables; types, mappers, pagination et règles d’interaction le sont conceptuellement.

## 20. Analyse de la landing actuelle

Fichier d’entrée : `yeyamo-admin/app/page.tsx`; composition : `components/landing/landing-page.tsx`, header, hero, features, destinations, community, app showcase/download, FAQ, CTA et footer. Dépendances : Framer Motion, actifs `public/landing`, `public/destinations`, `public/community`, marque et polices locales. SEO : metadata globale dans `app/layout.tsx` actuellement orientée landing Cameroun. Liens : ancres internes, stores et accès dashboard selon composants. Décision : déplacer l’ensemble vers `/about`, réutiliser FAQ dans `/help`, destinations dans `/explore`, app-download dans `/about`; ne pas supprimer à ce stade.

## 21. Protection de `/admin/**`

Garanties impératives :

1. Conserver le matcher middleware strictement limité à `/admin/:path*`.
2. Conserver les cookies `yeyamo_admin_*`; créer des noms User distincts.
3. Ne pas élargir le proxy Admin ni lui injecter un token User.
4. Maintenir le layout et `admin.css` dans le group Admin; éviter des sélecteurs globaux publics.
5. Ne pas faire dépendre `AppProviders` d’une session User obligatoire.
6. Garder `SessionProvider`, permissions et scopes Admin isolés.
7. Ne pas réutiliser `AdminShell` pour Partner.
8. Conserver les routes catch-all et pages explicites Admin; tester les 96 pages après ajout du public.
9. Ne pas modifier les contrats/idempotency financiers Admin.
10. Ajouter des tests de non-régression pour `/admin/login`, redirect middleware, dashboard, proxy forbidden et refresh.

## 22. Analyse Auth User / Partner / Admin

| Élément | Mobile User | Mobile Partner | Web Admin actuel | Futur Web User |
|---|---|---|---|---|
| Login | `/auth/login`, OAuth | même auth + `user_type` | route Next serveur vers `/api/v1/auth/login` | route serveur/User BFF dédiée |
| Stockage | Expo SecureStore | idem | cookies HttpOnly `yeyamo_admin_*` | cookies HttpOnly `yeyamo_user_*` recommandés |
| Refresh | refresh token Axios | idem | `/api/auth/refresh`, cookie HttpOnly | endpoint distinct ou cookie namespace User |
| Session | Zustand + `/auth/me` | rôle/type partenaire | `/api/auth/session` + AdminSession | `/api/user/session` proposé, non créé |
| RBAC | surtout garde auth | user_type + accès métier | roles/permissions/scopes | user roles; backend autorité |
| Risque | token exposé si copié en JS | confusion Partner/Admin | collision si noms/routes partagés | isoler clients, cookies et providers |

## 23. API et contrats réutilisables

| Domaine | Contrats Mobile observés | Méthodes/pagination | Web existant | Décision |
|---|---|---|---|---|
| Feed/posts | `/feed`, `/posts/**`, `/interactions/posts/**` | GET page/size, PUT/DELETE/POST | aucun public | réutiliser types/mappers, nouveau BFF public |
| Discovery | `/discovery/search`, `/trending`, `/recommendations` | GET filtres/pages | Admin search non équiv. | réutilisable |
| Places/maps | `/places/**`, `/activities/**`, `/maps/**` | GET/POST, pages | proxy allowlist + Mapbox | types partiels, auth à séparer |
| Events | `/events/**` | GET/POST/DELETE | API Admin events | contrat commun partiel |
| Bookings/tickets | `/bookings/**`, `/tickets/**` | GET/POST/PUT/DELETE, idempotence | Admin booking/tickets | réutiliser DTO; préserver idempotence |
| Culture | `/culture/**`, `/culture-graph/**` | GET pages, POST/PUT | catalog Admin | très portable |
| Artisans/artworks | `/artisans/**`, `/artworks/**`, offers/orders | GET pages, POST/PATCH | partners/catalog Admin | types à rapprocher |
| Social | `/users/social/**`, `/collections/**` | GET pages, PUT/POST/DELETE | collections Admin | nouveau client User |
| Chat | `/messaging/**` + Reverb | GET/POST + socket | aucun équivalent | adapter transport navigateur |
| Partner | `/partners/**`, `/campaigns/**`, promotions, finance | CRUD/pages | nombreuses APIs Admin | contrats différents selon privilège |

Les payloads/réponses exacts restent définis dans les `types.ts`, `schemas.ts`, mappers et fichiers `*.api.ts`; leur copie directe dans le Web créerait de la divergence. Le Prompt 2 devra proposer un package de contrats partagé ou une génération OpenAPI.

## 24. Dettes Mobile à ne pas migrer

| Élément Mobile | Problème | Décision Web |
|---|---|---|
| `mockData.ts`, `*.demo.ts` | donnée simulée/fallback | état indisponible explicite, pas de mock production |
| `register-partner*` | aliases redirects | une inscription paramétrée |
| `become-artisan/*` | re-exports/routes fantômes | un formulaire Web |
| event tickets/checkout | routes orphelines | reconstruire navigation |
| region detail | orpheline | réévaluer avant portage |
| collections add page | action contextuelle devenue route | modal |
| create event settings | comportement mock | intégrer seulement après contrat |
| partner analytics/orders | logique partielle | états « indisponible » tant que backend absent |
| composants bottom sheets remplacés | doublons UI | utiliser filtres Desktop |
| session demo-user/demo-partner | mode local | ne jamais introduire en production Web |

## 25. Blocages backend

| Fonction | Mobile | Backend détecté | Web possible maintenant | Blocage |
|---|---|---|:---:|---|
| Feed/publication | contrats réels | oui | oui, sous réserve anonymat GET | vérifier que GET accepte sans JWT |
| Recherche/discovery | contrats réels | oui | oui | vérifier accès public/CORS via BFF |
| Suggest place | UI step2 mock | submit non prouvé | non complet | contrat final |
| Passport | store/mock | contrat incomplet | non réel | persistance serveur |
| Saved artworks | écran/hook | endpoint exact non établi | partiel | **À VÉRIFIER** |
| Reviews user/partner | UI présente | endpoint exact non établi | partiel | **À VÉRIFIER** |
| Event settings | UI mock | aucun contrat spécifique prouvé | non | contrat |
| Partner event analytics/orders | UI partielle | métriques partielles | partiel | synthèse/commandes |
| Support utilisateur | pages statiques | ticket support non prouvé | contenu oui, ticket non | API support |
| Notifications Web push | mobile push | device push mobile | centre oui, push non | VAPID/service worker/backend Web Push |

## 26. Dépendances natives Mobile et équivalents Web

| Fonction | Dépendance Mobile | Équivalent Web possible | Impact |
|---|---|---|---|
| Photos/œuvres/stories | `expo-image-picker`, caméra | `<input type=file>`, MediaDevices | permissions et compression à refaire |
| Scan ticket | `expo-camera` | MediaDevices + lecteur QR | HTTPS obligatoire, fallback manuel |
| Localisation | `expo-location` | Geolocation API | consentement contextuel |
| Carte | `react-native-maps` | `mapbox-gl` déjà installé | composants entièrement distincts |
| Notifications | `expo-notifications` | Notifications/Push API | service worker + backend |
| Jetons | `expo-secure-store` | cookies HttpOnly | BFF requis |
| Haptics/navigation bar | Expo | aucun besoin | supprimer |
| Deep links | `expo-linking` | URLs Next.js | plus simple; validation `next` |
| Partage | API native | Web Share + clipboard | fallback requis |
| Vidéo | `expo-video` | HTML `<video>` | autoplay/accessibilité |
| WebView splash | WebView | aucun | onboarding non porté |
| QR affiché | `react-native-qrcode-svg` | SVG/Canvas Web | faible impact |

## 27. Lots de migration prioritaires

- **P0 Socle** : route group public, auth User séparée, session/return URL, client public, shell, Feed `/`, post et profil public.
- **P1 Découverte** : explore, search, map, places, events, experiences.
- **P2 Social** : interactions, followers, collections, notifications, messages.
- **P3 Transactionnel** : activités, bookings, ticketing, paiements, commandes œuvres.
- **P4 Culture** : hub, contenus, langues, leçons, défis, passeport après backend.
- **P5 Partner** : candidature, dashboard, places/events, réservations, campagnes, finance, ticketing/staff.
- **Transverse permanent** : tests de non-régression Admin à chaque lot.

## 28. Scores de portabilité

Formule : 25 % maturité Mobile + 25 % disponibilité API + 20 % logique réutilisable + 15 % simplicité responsive + 15 % faible dépendance native/dette. Chaque facteur est noté sur 100 d’après les preuves du code.

| Module | Mature | API | Complexité Web (faible = bon) | Portabilité | Commentaire |
|---|---:|---:|---:|---:|---|
| Auth User | 85 | 90 | 65 | 81 | BFF/cookies à créer |
| Feed/posts | 90 | 90 | 45 | 77 | UI Desktop neuve |
| Discovery/search | 85 | 90 | 70 | 84 | excellent P1 |
| Places/maps | 85 | 90 | 45 | 75 | Mapbox déjà présent |
| Events | 85 | 90 | 60 | 81 | Admin fournit des types |
| Experiences/activities | 75 | 80 | 65 | 75 | catalogue partagé |
| Ticketing/bookings | 80 | 85 | 45 | 71 | idempotence et paiement |
| Culture | 85 | 90 | 75 | 86 | APIs riches, peu natif |
| Languages | 80 | 90 | 65 | 81 | audio/exercices à adapter |
| Artisans/artworks | 80 | 90 | 60 | 80 | commerce augmente le risque |
| Social/collections | 80 | 85 | 70 | 80 | mutations protégées |
| Chat | 80 | 80 | 35 | 67 | socket et workspace complexe |
| Passport/badges | 60 | 50 | 70 | 59 | persistance partielle |
| Partner dashboard | 70 | 75 | 30 | 63 | très grande surface |
| QR/push natif | 75 | 60 | 20 | 53 | APIs navigateur et backend |

## 29. Cartographie cible Yeyamo Web

```text
YEYAMO WEB
├── (public) Feed, Explore, Search, Map
│   ├── Posts / Stories / Profiles
│   ├── Places / Activities / Events / Experiences
│   ├── Culture / Languages / Challenges
│   └── Artisans / Artworks
├── (auth) Login / Register / Recovery
├── (user) Messages / Profile / Settings
│   ├── Favorites / Collections / Reservations
│   ├── Tickets / Orders / Passport / Badges
│   └── Create / Contribute
├── (partner) Dashboard / Places / Events
│   ├── Reservations / Reviews / Campaigns / Promotions
│   ├── Finance / Ticketing / Staff / Analytics
│   └── Artworks / Orders / Profile / Settings
├── (marketing) About / Help / Privacy
└── (dashboard) /admin/** — EXISTANT ET ISOLÉ
```

## 30. Compteurs globaux

Unité primaire : 166 fichiers-interface Mobile hors 7 layouts et 404. Les 103 lignes de la matrice regroupent 166 fichiers lorsque plusieurs étapes appartiennent à un même parcours.

| Compteur | Valeur reproductible |
|---|---:|
| Interfaces Mobile analysées | 166 |
| Layouts exclus | 7 |
| Route groups | 18 |
| Pages Web totales | 97 |
| Pages Web Admin | 96 |
| Pages Web publiques | 1 |
| Interfaces utilisateur déjà équivalentes | 0 |
| Interfaces explicitement Mobile-only | 4 |
| Fichiers/routes dette à ne pas copier tels quels | 11 minimum |
| Interfaces-fichiers à traiter (adapter/porter/fusionner/réévaluer) | 151 |
| Unités fonctionnelles de matrice | 103 |
| Routes publiques cibles estimées | 38 familles |
| Routes privées User estimées | 24 familles |
| Routes Partner estimées | 20 familles |
| Actions/familles déclenchant auth | 14 |
| Fonctions bloquées/partielles backend | 10 identifiées |
| Dettes Mobile listées | 10 catégories |

La distinction « porter/adapter/fusionner » s’applique aux **unités fonctionnelles** et non mécaniquement aux fichiers : **10 PTQ**, **64 ATQ**, **25 FW**, **1 MO (4 fichiers)**, **3 NPP**, **0 déjà existante** parmi les 103 lignes. Ces nombres se recomptent dans la colonne Classification. Les 11 fichiers de dette incluent aussi des sous-routes regroupées dans des lignes FW (notamment les re-exports artisan), d’où la différence entre compteurs de lignes et de fichiers.

## 31. Écart Mobile ↔ Web en pourcentage

1. Fonctionnalités Mobile équivalentes sur Web grand public : **0/103 = 0 %**.
2. Fonctionnalités nécessitant une interface Web : **99/103 = 96,1 %** (PTQ + ATQ + FW; le reste est MO/NPP).
3. Fonctionnalités à adapter ou fusionner plutôt qu’à copier : **89/99 = 89,9 %** des fonctionnalités à construire.
4. À ne jamais porter : onboarding; haptics/navigation bar; routes alias, orphelines et mocks comme solutions finales.
5. Plus faciles : culture catalogue, discovery, auth recovery, listes artisans/artworks.
6. Plus difficiles : chat, partner dashboard, ticketing/paiement, scan/push, Feed Desktop performant.
7. Bloqués : passport réel, suggest place final, certains reviews/support/settings event/analytics partner.
8. Même repository : **oui**, grâce aux route groups et au middleware Admin déjà ciblé.
9. Risques Admin : cookies/session collision, proxy élargi, providers globaux, CSS global, middleware trop large, composants Admin détournés.
10. Stratégie minimale-régression : ajout parallèle par route group, auth User séparée, contrats partagés, tests Admin systématiques, activation progressive.

## 32. Risques techniques

- Le `package.json` Mobile est Expo SDK 57 alors que l’instruction repository mentionne des docs v56 : toute implémentation future doit d’abord résoudre cette divergence de version; le présent audit n’écrit aucun code Expo.
- Les GET publics peuvent encore être protégés côté backend; à vérifier avant P0.
- Dupliquer les types Mobile/Admin créerait des contrats divergents.
- Deux systèmes de refresh dans le navigateur peuvent provoquer des boucles si cookies/providers ne sont pas isolés.
- Les médias verticaux du Feed peuvent dégrader Core Web Vitals sans stratégie image/vidéo.
- L’utilisation de composants Admin dans le Partner pourrait fuiter permissions et affordances de modération.
- Les modes demo Mobile peuvent masquer des contrats manquants.
- SEO/métadonnées actuels sont globaux et orientés landing; ils doivent devenir segmentés.
- Les routes dynamiques username/id doivent éviter les collisions.
- Paiement, holds et commandes exigent idempotence, reprise et sécurité serveur.

## 33. Recommandations pour le Prompt 2

Le Prompt 2 doit produire une architecture, pas commencer par copier des écrans. Décisions attendues : route groups `(public)/(auth)/(user)/(partner)/(dashboard)`; BFF public/User distinct du proxy Admin; cookies User dédiés; package/types générés depuis contrat; catalogue de composants public; stratégie SSR/SEO/cache; garde d’action avec `next`; matrice de tests Admin; feature flags de déploiement; conventions d’erreurs, pagination, uploads et sockets.

Ordre conseillé : valider l’accès backend anonyme au feed/discovery; figer l’auth User Web; implémenter le shell et `/`; ajouter post/profil; livrer découverte; seulement ensuite transactions, culture avancée et Partner.

## 34. Conclusion

Le Web actuel peut accueillir Yeyamo grand public sans nouveau repository, à condition de traiter `/admin/**` comme un produit voisin et protégé. La migration n’est pas un port React Native vers React : c’est une réutilisation des règles métier, endpoints, types et mappers dans des interfaces Web nouvelles. Le chemin le plus sûr consiste à construire un socle public parallèle, faire du Feed la racine, déplacer la landing vers `/about`, déclencher l’auth uniquement sur action, et conserver une séparation stricte User/Partner/Admin.
