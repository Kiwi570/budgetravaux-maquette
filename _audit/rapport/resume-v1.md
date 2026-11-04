# Audits de la v1 (4 novembre 2026)

1. **Audit standard** (7 pages, 5 tailles, modes normal, calme, sans WebGL, sans JavaScript ; films, bords, parcours, fluidité, mouvement, vitesse) : 2 échecs restants.
   - intro de l'accueil accélérée par la molette en 1 130 ms (limite 1 100 ms) : intro de l'accueil resserrée, rendu de la lampe allégé pendant l'intro ;
   - filtre « Tous » de Plomberie en détail : déclencheur de défilement décalé de 19 px (posé sur un élément en cours d'apparition) : déclencheurs déplacés.
2. **Audits ciblés** après ces corrections :
   - `--pages=/,/plomberie --seulement=fichiers,films,parcours,mouvement,fluidite` : intro accélérée et passée par chaque geste ;
   - `--pages=/,/plomberie,/depannage --seulement=fichiers,mesures,parcours,mouvement` : **0 échec** ;
   - `--pages=/renovation --seulement=fichiers` après un recadrage : 0 échec.
3. **À regarder** (non bloquant) : horloge des tarifs qui ne bouge qu'au clic ou au glissement (la section a d'autres effets), léger écart au rechargement au milieu de Rénovation (planches empilées), 3 à 4 % d'images lentes au défilement sur Dépannage et Rénovation avec un processeur ralenti 4 fois.
4. **Non lancé par le script** : le parcours du bouton « Réduire les animations » (le script ne peut pas cliquer le menu quand l'en-tête est caché). Vérifié à la main à 1366×768 et 390×844 : mode calme actif, retour à la section, sans intro, aucune boucle ; puis rétablissement, même section. Safari (WebKit) : indisponible ici, liste de vérifications dans le README.
