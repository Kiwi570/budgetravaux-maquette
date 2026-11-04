# Audits de la v2 (4 novembre 2026)

1. **Audit standard** (7 pages) après les nouvelles ouvertures : 40 échecs, tous sur les ouvertures neuves. Les liens du sommaire de Plomberie et le numéro de Contact étaient trop petits au doigt. Les chiffres du numéro étaient vus comme coupés (masque d'apparition). Les étapes du mètre ruban étaient coupées à 320 px, avec un contraste mal mesuré sur le ruban en dégradé. Les lignes du ticket de Dépannage clignotaient à l'arrivée par le voile. L'intro de l'accueil était accélérée par la molette en 1 105 ms (limite 1 100).
2. **Corrections**, puis relance des étapes en échec sur toutes les pages (`--seulement=fichiers,mesures,films,parcours`) : **0 échec**.
3. **À regarder**, non bloquant : le changement d'écran au retour arrière vers l'accueil sur téléphone (passage normal d'une page à l'autre, puis la lampe s'allume), et l'écart de 6 % au rechargement au milieu de Rénovation (planches empilées).
4. **Non lancé par le script** : le bouton « Réduire les animations ». Il a été vérifié à la main en v1 et n'a pas été modifié depuis. Safari n'a pas pu être testé non plus : voir la liste à vérifier dans le README.
