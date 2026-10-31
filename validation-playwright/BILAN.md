# Bilan de validation — 29 octobre 2026

Ce bilan décrit la validation effectuée **avant l’ajout du mode iframe**.
Pour ce changement ultérieur, `npm run build` a réussi et les quatre entrées
`*Dash.html` sont générées. Les tests ont été adaptés/préparés, mais aucune
régression Playwright n’a été exécutée, conformément à la demande de l’utilisateur.
Les résultats de 223 tests ci-dessous concernent donc la version précédente.

Les trois points de compatibilité URL sont implémentés dans `newSite`.

- Le build génère `pena.html`, `energy.html`, `polar.html`, `autoSail.html` et
  leurs quatre variantes `En.html`. Ces fichiers chargent exactement la même
  application compilée. Le serveur statique de test ne possède aucune règle de
  réécriture ni fallback SPA.
- Les quatre outils lisent les paramètres historiques et leurs réglages
  supplémentaires avec validation, bornage et priorité sur la session. L’adresse
  initiale reste inchangée. Les changements explicites de langue et de thème
  restent cohérents après navigation et rechargement.
- Les liens du menu, de l’accueil et de l’aide utilisent les adresses classiques
  et transmettent les réglages courants. Les anciens liens hash restent reconnus.
  Les pages iframe `*Dash.html` ne font pas partie de cette implémentation.

Le contrat complet et les exemples sont dans [URL-PARAMETERS.md](../URL-PARAMETERS.md).
Pour conserver les liens publics existants, déployer le contenu de `dist/` dans
le même répertoire public que les anciennes pages. Aucun déploiement n’a été effectué.

## Corrections vérifiées

- Polaire Expert mobile : diagramme et informations empilés, largeur utile
  conservée et rayon adapté. Les commandes Expert défilent sous 900 px afin de
  ne plus masquer le tracé. Le test vérifie les anneaux dessinés et que le centre
  du canvas est réellement accessible, avant la réinitialisation du zoom.
- Voiles Auto : état vide explicite, hauteur stable des graphiques après calcul
  et légendes lisibles. Le couple Code 0/LJ produit un vrai recouvrement avec les
  données Class 40, validé à 360, 390, 820 et 1280 px. Le couple initial Code 0/Jib
  reste inchangé et son absence de recouvrement est vérifiée.
- Pénalités et Énergie : réglages sans chevauchement ni débordement, graphique
  Rentabilité lisible sur mobile.
- Aide : sommaire droit limité aux sous-chapitres du chapitre lu, liens profonds
  et rechargement conservés, captures manquantes corrigées.
- Le retrait volontaire de « Nouvelle interface » du catalogue est conservé,
  conformément à la confirmation de l’utilisateur. Ses deux anciens cas FR/EN
  vérifient désormais son absence et le retour au sommaire via son ancien lien.
  Les contrôles des sept pages actives restent inchangés.

## Résultats finaux

`pnpm exec playwright test --workers=1` : **223 tests réussis**, aucun échec,
aucun test ignoré, durée 7,8 minutes.

| Couverture | Tests réussis |
| --- | ---: |
| URL, paramètres, préférences et navigation | 27 |
| Build et serveur statique réel | 11 |
| Polaire Expert, quatre largeurs × grille/focus | 8 |
| Recouvrement réel Code 0/LJ | 4 |
| Autres contrôles de l’aide, calculs, dispositions et rendus | 173 |
| Total | 223 |

`npm run build` : **réussi**, TypeScript et Vite, huit entrées HTML générées.

Le seul avertissement de build concerne les deux bundles JS dépassant le seuil
Vite de 500 ko après minification : application 520,74 ko, aide 648,55 ko. Le seuil
n’a pas été relevé. Aucun échec bloquant ne reste dans les vérifications exécutées.

## Captures et preuves

Les 36 références gardent exactement leurs empreintes pendant l’implémentation
des URL et le dernier correctif Expert. Lors de la phase précédente de correction
des rendus, 13 références avaient été actualisées après revue visuelle ; les
originaux et leurs justifications sont conservés dans
[la comparaison des références](references-review.html).
La tolérance de comparaison reste à 1 %.

- [Polaire Expert mobile, grille](expert-after/expert-viewport-grid-360.png)
- [Polaire Expert mobile, focus](expert-after/expert-viewport-focus-360.png)
- [Rapport Playwright final](../playwright-report/index.html)

Les régressions Expert ont été reproduites avant correction : archives
`expert-before/` (largeur) et `expert-sticky-before/` (masquage par les commandes).
