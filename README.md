# ITYC — nouvelle interface

Socle React, TypeScript et Vite destiné à remplacer progressivement le site historique.
Le répertoire historique reste intact ; tout le travail de migration se fait ici.

## Développement

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Le résultat est produit dans `dist/`. Vite donne un nom hashé aux JS et CSS : chaque
nouvelle version est ainsi téléchargée sans conflit de cache avec l’ancienne.

Le build génère aussi les entrées classiques `pena.html`, `energy.html`,
`polar.html` et `autoSail.html`, ainsi que leurs variantes `En.html`. Ces huit
fichiers reprennent exactement le HTML compilé d’`index.html` et ses ressources
hashées. Ils peuvent être servis directement par un hébergement statique, sans
redirection ni règle de réécriture pour ces chemins. Quatre entrées supplémentaires
`penaDash.html`, `energyDash.html`, `polarDash.html` et `autoSailDash.html` chargent
les mêmes outils en mode iframe : menu compact, bateau et options fixés par
l’URL, réglages de simulation disponibles, sans pied de page. Les iframes ne
lisent ni n’écrivent les réglages mémorisés des pages normales.
Les paramètres acceptés et leur priorité
sont décrits dans [URL-PARAMETERS.md](URL-PARAMETERS.md).

## Déploiement Plesk

1. Construire le projet avec `npm run build`.
2. Déployer le contenu de `dist/` dans le répertoire servi par l’application Node ou le vhost.
3. Ne pas mettre les fichiers HTML durablement en cache ; mettre les fichiers hashés de `assets/`
   en cache long et immutable.

`public/.htaccess` est copié au build pour les installations Apache. Si Plesk/Nginx sert
le site, appliquer les mêmes règles de cache dans la configuration du domaine.

## Prochaine étape

Migrer Polaire dans `src/features/polar/`, en réutilisant d’abord les calculs et workers
existants sans en modifier le comportement.
