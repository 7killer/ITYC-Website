# ITYC — Inter Team Yacht Club

Le site ITYC rassemble des outils d’analyse et de préparation pour les skippers de **Virtual Regatta**. Son objectif : aider à comprendre les performances des bateaux, anticiper les manœuvres et mieux préparer ses courses.

Disponible en **français et en anglais**, l’interface s’adapte aux ordinateurs, tablettes et mobiles, avec un thème clair et un thème sombre.

**Site : [ityc.fr](https://ityc.fr)**

## Les outils

- **Polaires** : explorer les vitesses selon le vent, les angles, les voiles et les options du bateau.
- **Voiles automatiques** : analyser les zones et les seuils de changement de voile.
- **Pénalités** : estimer le temps et la distance perdus lors des manœuvres.
- **Énergie** : simuler les pertes d’énergie et le temps de récupération du skipper.
- **Aide et tutoriels** : consulter la documentation, les explications et le glossaire, avec une recherche intégrée.
- **Dashboard** : retrouver la présentation, les téléchargements et la documentation de l’extension VR Dashboard.

Le site utilise **React, TypeScript et Vite**. Les graphiques s’appuient sur Chart.js et certains calculs s’exécutent dans des Web Workers. La suite **Playwright** vérifie les parcours, la mise en page et les comparaisons visuelles.

## Prérequis

- **Node.js 22 à jour**, conformément au fichier `.nvmrc`.
- **pnpm** installé et accessible dans le terminal.
- **Google Chrome** pour exécuter les tests Playwright.

Si pnpm n’est pas encore installé :

```sh
npm install -g pnpm
```

## Reconstruire le site

Depuis la racine du dépôt, dans le dossier contenant `package.json` :

```sh
pnpm install
pnpm build
```

Sur Windows, pour le dépôt situé dans `C:\virtual regatta\git\ITYC-Website`, ouvrir PowerShell et exécuter :

```powershell
Set-Location "C:\virtual regatta\git\ITYC-Website"
pnpm install
pnpm build
```

`pnpm build` vérifie le code TypeScript puis génère le site de production dans **`dist/`**. Après une modification des sources, relancer `pnpm build` ; si les dépendances ont changé, exécuter d’abord `pnpm install`.

## Développer en local

```sh
pnpm dev
```

Ouvrir l’adresse affichée dans le terminal. Les modifications des sources sont rechargées automatiquement pendant le développement.

Pour vérifier le résultat du build en local :

```sh
pnpm build
pnpm preview
```

Ouvrir l’adresse indiquée par Vite. Le serveur de prévisualisation permet de contrôler le contenu compilé avant sa publication.

## Tests Playwright

Après `pnpm install`, avec Google Chrome installé :

```sh
pnpm test:visual
```

Playwright démarre automatiquement le serveur Vite nécessaire aux tests. La configuration se trouve dans `playwright.config.ts` et les tests dans `tests/visual/`.

Pour lancer uniquement l’audit responsive :

```sh
pnpm test:responsive
```

Pour consulter le dernier rapport HTML :

```sh
pnpm test:visual:report
```

Les images de référence sont conservées dans `tests/visual/responsive.spec.ts-snapshots/`. Les références actuelles ont été produites sous Windows. Après une modification visuelle volontaire, elles peuvent être régénérées puis vérifiées avant d’être ajoutées au dépôt :

```sh
pnpm test:visual:update
```

Les résultats d’exécution et les rapports sont générés dans `test-results/` et `playwright-report/`. Ils sont exclus de la copie des sources, tout comme `validation-playwright/`, qui contient des éléments de validation locale. Les images de référence font partie de la suite de tests et sont copiées.

## Publier le site

1. Exécuter `pnpm install`, puis `pnpm build`.
2. Transférer **le contenu de `dist/`** à la racine du site sur l’hébergement.
3. Inclure les fichiers cachés, notamment `.htaccess`, ainsi que `assets/`, `data/`, `robots.txt` et `sitemap.xml`.

Le résultat est un site statique : l’hébergement sert les fichiers générés et n’a pas besoin d’un serveur Node.js pour les exécuter. Le dossier `dist` lui-même ne doit pas constituer un niveau supplémentaire dans l’URL publique.

Le build produit les pages françaises et anglaises, les pages d’aide, les vues intégrées au Dashboard et le sitemap. Les adresses historiques des outils restent disponibles.

Sur Apache, `public/.htaccess` est inclus au build et définit notamment la redirection HTTPS et les règles de cache. Pour Nginx ou un autre serveur, configurer les règles correspondantes sur l’hébergement.

La configuration actuelle cible la racine de **`https://ityc.fr`**. Pour utiliser un autre domaine, adapter les URL publiques dans `src/shared/navigation/publicPages.ts` ainsi que `public/robots.txt`.

## Organisation du dépôt

| Chemin | Contenu |
| --- | --- |
| `src/` | Application, outils, calculs, styles et documentation intégrée |
| `public/` | Images, données des polaires et fichiers statiques |
| `build/` | Plugin Vite qui génère les pages HTML et le sitemap |
| `tests/` | Tests Playwright et images de référence |
| `playwright.config.ts` | Configuration des tests |
| `vite.config.ts` | Configuration du serveur local et du build |
| `dist/` | Site de production généré par `pnpm build` |

Le dossier **`build/` contient du code source nécessaire à la compilation**. `dist/`, `node_modules/` et les résultats des tests sont générés localement et exclus de la copie des sources.
