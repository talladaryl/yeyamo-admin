# Pages publiques YeYamo

- `/` : accueil ; `/documentation` : guides ; `/confidentialite` : politique de confidentialité.
- `?lang=fr` et `?lang=en` déterminent la langue côté serveur, y compris le titre, la description et l’attribut HTML `lang`. Toute autre valeur revient au français.
- Le sélecteur conserve la page et son ancre. Les liens internes entre pages conservent la langue.
- Les traductions de l’accueil sont dans `lib/public/translations.ts` ; les deux versions des documents sont dans `lib/public/resource-content.ts`.
- Les routes publiques ne nécessitent pas de session. La protection `/admin` est conservée.

## Accueil et pages de rubriques

L’accueil contient le hero et le pied de page. Chaque rubrique dispose de sa page : `/fonctionnalites`, `/solutions`, `/profils`, `/destinations`, `/communaute`, `/securite`, `/application`, `/a-propos`, `/faq` et `/telechargement`. Les pages sont déclarées dans `lib/public/pages.ts` et rendues par `app/[publicPage]/page.tsx`. Une adresse inconnue retourne une page 404.

L’accueil conserve son fond et sa mascotte animée. Chaque rubrique a une illustration SVG thématique distincte dans `public/backgrounds`, choisie par `components/landing/public-hero-background.tsx`. Le script `node scripts/generate-public-backgrounds.mjs` régénère ces illustrations. La navigation commune remplace les liens de retour et les pastilles de bas de page. Documentation et confidentialité partagent les accordéons, avec ouverture depuis le sommaire et commandes pour tout déplier/replier.

Les boutons App Store et Google Play comportent leurs logos et des libellés FR/EN. Renseigner `NEXT_PUBLIC_APP_STORE_URL` et `NEXT_PUBLIC_PLAY_STORE_URL` avec les liens HTTPS des fiches officielles puis reconstruire le site. En l’absence de lien, le bouton est désactivé avec la mention « Lien officiel bientôt disponible ».

La page Communauté affiche les trois témoignages déjà présents dans `data.ts`. Les mentions d’exemple ont été retirées à la demande du propriétaire ; cette modification ne vérifie pas leur authenticité. Le footer utilise `Support@yeyamo.com`. Le sommaire de confidentialité est affiché en entier, sans défilement interne.

## Animation d’introduction

L’intégration se trouve dans `app/page.tsx` : `LandingIntro` entoure le contenu de l’accueil. Le composant est dans `components/landing/landing-intro.tsx`, ses styles dans `landing-intro.css`, et le SVG extrait du fichier utilisateur `Yeyamo_animation.html` dans `intro-logo.tsx`. Aucun script du fichier HTML n’est exécuté.

Le tracé se déroule en trois étapes (symbole, nom, signature), sur environ trois secondes. L’introduction est affichée une seule fois par session de navigateur, avec un cookie de session (`yeyamo_intro_seen`). Le serveur lit ce cookie pour éviter un flash de l’introduction au retour sur l’accueil. Le bouton Passer et Échap permettent de la fermer. Les liens avec ancre et la préférence de réduction des animations ouvrent directement le contenu. Un délai maximal de quatre secondes évite qu’une animation défaillante bloque la page. Sans JavaScript, un style `noscript` masque l’introduction et laisse le contenu accessible.

## Informations à confirmer avant publication de la politique

Le dépôt ne fournit pas l’identité juridique complète du responsable de traitement, son adresse postale, l’inventaire des sous-traitants et pays d’hébergement, ni les durées de conservation métier. Le texte décrit les traitements selon les fonctionnalités utilisées et les critères de conservation, sans inventer ces informations. L’équipe doit compléter ces éléments avec ses pratiques réelles et confirmer l’adresse de contact existante `hello@yeyamo.cm`.

Les cookies d’administration décrits correspondent à `lib/server/backend.ts`. La langue utilise uniquement un paramètre d’URL. Les liens des boutiques d’applications sont des valeurs d’exemple préexistantes et doivent être remplacés par les liens de publication réels.

Référence rédactionnelle pour les thèmes d’information et les droits, sans présumer du régime applicable à YeYamo : [CNIL — Informer les personnes](https://www.cnil.fr/fr/informer-les-personnes). Cette référence ne constitue pas une certification de conformité.

Les guides publics décrivent les fonctionnalités conditionnellement lorsqu’elles dépendent de l’application mobile ou d’un partenaire. Ils ne présentent pas les API privées d’administration comme une API publique.
