# Budgetravaux — maquette v1

Maquette du site de Budgetravaux (dépannage plomberie, chauffage, électricité et rénovation tous corps d'état dans l'Oise), direction artistique « Derrière le mur ».
Adresse prévue : https://budgetravaux-maquette.vercel.app · site actuel : budgetravaux.fr (jamais lié depuis la maquette).

## Pages

| Page | Fichier | Contenu |
|---|---|---|
| Accueil | `index.html` | Lampe torche WebGL qui révèle le réseau derrière le mur, urgences, 8 forfaits, tableau des corps d'état, intervention, zone, plomberie en détail, engagements, devis, appel |
| Dépannage & tarifs | `depannage.html` | Forfaits, caméra thermique (démonstration), horloge des tarifs soir et week-end, dépannages courants, FAQ |
| Rénovation | `renovation.html` | Tableau à disjoncteurs complet, trois projets en planches empilées, garanties |
| Plomberie en détail | `plomberie.html` | Douche, baignoire, lavabo, WC, chauffe-eau, cuisine, recherche de fuite, filtres en vannes |
| Devis en ligne | `devis-en-ligne.html` | Estimateur en 4 étapes, ticket calculé sur les prix publiés (simulé) |
| Contact & RDV | `contact.html` | Rendez-vous en 3 étapes avec les champs du site actuel (simulé), coordonnées, carte |
| 404 | `404.html` | « Cette page a fui. » |

Pages du site actuel non reprises (possibles en v2) : une fiche par corps d'état (8), les 7 devis plomberie séparés, espace client, espace professionnels.

## Effets propres (plan d'animation)

`lampe` (ouverture de l'accueil, WebGL), `reseau` (goutte dans le tuyau des urgences), `ticket` (tickets qui s'impriment), `disjoncteurs` (tableau des métiers), `compteur-eau` (étapes), `ricochet` (carte de l'Oise), `thermique` (caméra thermique), `horloge` (tarif selon l'heure). En plus : `planches`, `vannes`, `estimateur`. Effets de la bibliothèque du socle : lignes, mots, cascade, rideau, parallaxe, zoom, trace, galerie, onde, magnétique.

## Commandes

```
node outils/generer.mjs          pages HTML depuis donnees/ et source/ (ne jamais modifier les .html à la main)
node outils/images-partage.mjs   images de partage 1200×630 (assets/partage/)
node _audit/audit.mjs            audit standard avant livraison (--complet pour la version finale)
```

## Images

- **Site actuel** : seul le logo (`assets/images/logo-budgetravaux.png`) est repris ; l'emblème a été redessiné en SVG (`logo.svg`, `logo-clair.svg`, `favicon.svg`) d'après ce logo. Les « réalisations » du site actuel sont des illustrations générées montrant d'autres artisans, et les bandeaux sont des photos de banque d'images : elles ont été écartées.
- **Illustrations générées (Grok)** : tout le dossier `assets/images/grok/`. Chacune porte la mention « Illustration générée », à **garder** sur le site final.
- **À remplacer dès que possible** par de vraies photos : chantiers terminés, photo de Pedro, véhicule et outillage éventuels.
- **À régénérer** : `equip-douche.jpg` (colonne de douche incomplète : tuyau de cuivre sans pomme de douche). Consigne corrigée dans la conversation de la v1.

## Ce que le client doit fournir (à compléter)

| Information | État |
|---|---|
| Mentions légales : raison sociale exacte, forme juridique (EI), SIRET (le site affiche « SIREN 53809824500052 », 14 chiffres), RCS ou RM, directeur de la publication | à compléter |
| Politique de confidentialité (RGPD) | à compléter |
| Hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (adresse reprise par de nombreuses mentions légales, à revérifier sur vercel.com à la mise en ligne) | à vérifier |
| Assurance décennale : assureur, numéro de contrat, couverture géographique | à compléter |
| Prix : confirmer qu'ils sont TTC (obligatoire pour les particuliers) ; tarif avant 8 h | à compléter |
| Horaires d'intervention, e-mail de contact | à compléter |
| Photos réelles de chantiers et de Pedro | à fournir |
| Crédits des illustrations générées (Grok) | à reporter dans les mentions |

Incohérences du site actuel à trancher : nom (Budgetravaux, BudgeTravaux, BudgetTravaux, « Dépannage 60 »), zone (Oise, mais « Paris et Île-de-France » dans un lien), rôle (artisan qui réalise, ou plateforme de mise en relation selon les CGV), « Longeuil » au lieu de Longueil, « 7j/7 » sur une seule page.

## À la mise en ligne définitive

- Retirer : `noindex` (balise robots dans `source/gabarits/commun.mjs`, en-tête X-Robots-Tag dans `vercel.json`), formulaires et estimateur simulés (à brancher), démonstration de la caméra thermique (garder la mention « Démonstration illustrative » ou la retirer), mentions « à compléter » une fois remplies.
- Garder : la mention « Illustration générée » sur chaque image créée par IA.
- Règle du secteur (arrêté du 24 janvier 2017) : barème des principales prestations publié (fait), devis remis avant tout contrat quel que soit le montant (annoncé), prix TTC pour les particuliers (à confirmer).

## Vérifications à faire dans Safari sur le Mac (WebKit indisponible pour l'audit)

- Ouverture de chaque page : intro complète au premier chargement et au rechargement, rien qui clignote.
- Changement de page : le voile couvre l'écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement natif fluide, en-tête qui se cache et revient sans clignoter, galerie « Plomberie en détail » entière quand elle est épinglée.
- Lampe de l'accueil : le faisceau suit la souris, les tuyaux apparaissent dans le rond.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière ; barre Appeler / Devis en bas.
