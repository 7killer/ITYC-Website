# Paramètres des pages outils

Le build fournit les anciennes adresses `pena.html`, `energy.html`, `polar.html`
et `autoSail.html`, ainsi que `penaEn.html`, `energyEn.html`, `polarEn.html` et
`autoSailEn.html`. Chaque fichier charge la même application compilée. Déployer
le contenu de `dist/` aux emplacements publics de ces anciennes pages suffit :
aucune redirection ni réécriture serveur n’est nécessaire pour ces huit fichiers.
Quatre entrées supplémentaires utilisent la même application en mode iframe :
`penaDash.html`, `energyDash.html`, `polarDash.html` et `autoSailDash.html`.

L’adresse ouverte reste inchangée pendant le chargement et l’édition des champs.
Les liens du menu transmettent les réglages courants aux autres outils. Choisir
explicitement une langue ou un thème actualise l’adresse sans recharger les
graphiques. Les anciens liens `#polaire`, `#autosail`, `#penalites` et `#energie`
restent utilisables.

## Pages iframe

Le nom `*Dash.html` active une présentation compacte, même si la page est ouverte
directement. Aucun paramètre supplémentaire n’est requis. Le menu propose les
quatre outils et ses liens restent en `*Dash.html` avec le contexte URL courant.

- `b`, `o` et les options explicites (`fullPack`, `foil`, `hull`, `winch`,
  `furler`, `jacket`, `pug`, `sails`) définissent le bateau et son équipement.
  Ces commandes ne sont pas rendues et leur configuration d’origine est
  conservée dans les liens, indépendamment de l’outil visité.
- En l’absence de `o` valide, le mode iframe utilise une configuration sans
  extras, avec Jib/Spi pour les polaires. Les options explicites peuvent ensuite
  compléter cette configuration. Le bateau par défaut est Class 40 2021.
- TWS, TWA, vitesses, énergie, plages et sélecteurs de voiles Auto sont
  initialisés par l’URL et restent modifiables. Les modes Grille/Focus et
  Normal/Expert restent disponibles. Une voile Auto demandée mais absente de
  l’équipement est remplacée à l’ouverture par une voile disponible. Sans voile
  équipée, les sélecteurs l’indiquent et sont désactivés.
- Le thème est défini par `th` (sombre par défaut), la langue par `locale` ou
  `lang` (français par défaut). Il n’existe pas de fichier `EnDash.html` :
  utiliser par exemple `energyDash.html?lang=en&th=light`.
- Les pages iframe ne lisent ni ne modifient les réglages de session ou les
  préférences mémorisées des pages normales. Chaque iframe garde son propre
  état de simulation en mémoire ; une navigation le transmet dans les liens.
  Un rechargement réapplique l’URL et les défauts iframe.
- Le pied de page, les liens d’aide et les commandes de langue/thème du site
  complet sont retirés de cette présentation.

Exemple d’intégration :

```html
<iframe
  title="Polaire du bateau"
  src="polarDash.html?b=Class_40&amp;s=C0&amp;o=FP&amp;ts=16&amp;ta=110&amp;th=dark&amp;bs=12&amp;se=70"
  width="100%"
  height="800"
></iframe>
```

## Règles de lecture

- Les paramètres URL valides priment sur la session du navigateur, puis viennent
  les valeurs par défaut. Un paramètre absent ou invalide conserve la valeur de
  session ou la valeur par défaut.
- Les nombres finis sont bornés aux limites des contrôles. Le point et la virgule
  décimale sont acceptés ; zéro et `false` ne sont pas traités comme des absences.
- Les réglages spécifiques d’une carte priment sur les paramètres communs : par
  exemple `ts=16&lossWind=12` règle la perte d’énergie à 12 nds et la récupération
  à 16 nds.
- `tws` et `twa` sont des alias de repli pour `ts` et `ta`. Les paramètres
  historiques valides priment ; les alias déjà présents dans un lien sont
  actualisés avec les dernières conditions lors de la navigation.
- Les booléens acceptent `0`, `1`, `false` et `true`. Les options explicites telles
  que `winch=0` ou `foil=0` priment sur les presets `o` et `fullPack=1`.
- Le nom classique du fichier détermine la langue : suffixe `En.html` pour
  l’anglais, `.html` pour le français. Sur `index.html`, `lang=fr|en` ou
  `locale=fr|en` permet de choisir la langue. Sur une vue Accueil, Aide ou Dash
  ouverte par hash, ces paramètres sont prioritaires, même si le fichier porte
  le nom d’un outil.
- Les paramètres inconnus sont conservés dans les liens entre outils. Chaque
  outil applique seulement les réglages qui le concernent.

## Paramètres communs

| Paramètre | Valeur et effet |
| --- | --- |
| `b` | Bateau : ancien identifiant ou nom du sélecteur ; voir la table ci-dessous. |
| `s` | Voile scalaire : `J`, `S`, `C0`, `LJ`, `LG`, `HG` ou `SS`. Dans Voiles Auto, initialise les cinq sélecteurs ; les paramètres spécifiques permettent ensuite de les distinguer. |
| `o` | Options historiques : `FP` ou `AO` pour toutes, ou combinaison des lettres ci-dessous. `o=` désactive les extras et conserve Jib/Spi sur les outils de polaires. |
| `ts` | TWS en nds : polaire 1–40 ; Voiles Auto 0,1–50 ; Pénalités et Énergie 0,1–35. Initialise toutes les cartes concernées. |
| `ta` | TWA en degrés : valeur absolue, bornée à 0–180. Concerne Polaire et Voiles Auto. |
| `bs` | Vitesse du bateau en nds, bornée à 1–45. Dans Pénalités, initialise les vitesses simple, double et sans changement de voile ; la vitesse après changement de voile commence à `bs + 2`, bornée à 45. |
| `se` | Énergie du skipper en %, 0–100 pour Pénalités, 0–99,9 pour Énergie. |
| `th` | Thème : `dark` ou `light`. |
| `layout` | Présentation : `grid` ou `focus`. |
| `focus` | Carte sélectionnée en mode `focus`, index à partir de zéro : Polaire 0–6, Voiles Auto 0–3, Pénalités 0–2, Énergie 0–1. Sur Polaire et Voiles Auto, la page défile jusqu’à cette carte dans la liste des grandes courbes. |

Dans Voiles Auto, `ts` initialise aussi la plage de vent à `ts ± 4` et `ta` la
plage d’angle à `abs(ta) ± 10`, dans les limites des contrôles. Les bornes
explicites décrites plus bas priment sur ces plages initiales.

| Lettre de `o` | Option |
| --- | --- |
| `F` | Foils |
| `h` | Polish / coque |
| `R` | Code 0 |
| `L` | Voiles légères, LJ et LG |
| `H` | Voiles lourdes, HG et SS |
| `W` | Winch |
| `M` | Enrouleur |
| `J` | Veste |
| `P` ou `C` | Coussin |

Les lettres sont sensibles à la casse. Par exemple `o=FhRLH` active les options
de polaires, `o=WMJP` les équipements. `o=0` n’est pas une combinaison valide.

Les noms complets de voiles sont également acceptés : `Jib`, `Spi`, `Code0`,
`LightJib`, `LightGnk`, `HeavyGnk`, `Staysail` ; `Stay` est un alias de `SS`.

## Réglages supplémentaires

| Outil | Paramètres |
| --- | --- |
| Tous | `fullPack=0|1` ; `fullPack=1` applique le preset avant les options explicites. |
| Polaire et Voiles Auto | `foil=0|1`, `hull=0|1`, `sails=Jib,Spi,LightJib` pour la sélection exacte des voiles. Une liste vide est acceptée ; une liste contenant une voile inconnue est ignorée. |
| Polaire | `level=normal|expert`, `displayAuto=0|1`, `displayFoils=0|1`, `displaySails=0|1`. |
| Pénalités et Énergie | `winch=0|1`, `furler=0|1`, `jacket=0|1`. |
| Énergie | `pug=0|1` pour le coussin. |
| Pénalités | `simpleEnergy`, `doubleEnergy`, `rentEnergy` : 0–100 ; `simpleWind`, `doubleWind`, `rentWind` : 0,1–35 ; `simpleSpeed`, `doubleSpeed`, `withoutSpeed`, `withSpeed` : 1–45. |
| Énergie | `energy` : 0–99,9 ; `lossWind`, `recoveryWind` : 0,1–35. |
| Voiles Auto | `twsStart`, `twsEnd` : 0,1–50 ; `twaStart`, `twaEnd` : 0–180. |
| Voiles Auto | `sailForTwa`, `sailForTws`, `sailForRange`, `firstOverlapSail`, `secondOverlapSail` : un identifiant de voile chacun. |
| Voiles Auto | `precision=0.1|0.01` pour le recouvrement ; `overlapPrecision` est aussi accepté. |

Un Full Pack est décoché lorsqu’une option nécessaire ou une voile est
explicitement désactivée. Les liens transportent également les réglages propres
aux cartes déjà présentes dans le contexte : ces valeurs précises continuent de
primer sur les valeurs communes `ts`, `bs` et `se`.

## Identifiants historiques des bateaux

| `b` | Nom actuel |
| --- | --- |
| `Cruiser_Racer` | Cruiser Racer |
| `Class_40` | Class 40 2021 |
| `Figaro_III` ou `Figaro` | Figaro 3 |
| `Offshore_Racer` | OffShore Racer |
| `Imoca` | Imoca |
| `Mini_6.50` | Mini 6.50 |
| `MOD_70` | Mod70 |
| `Ocean_Fifty` | Ocean 50 (Multi 50) |
| `Volvo_65` | Volvo 65 |
| `Super_Maxi%20100` | Super Maxi 100 |
| `Tara` | Tara |
| `Ultim_Crew` | Ultim (Crew) |
| `Ultim_Solo` | Ultim (Solo) |
| `Ultim_BP%20XI`, `Ultim_BP_11` ou `Ultim` | Ultim BP XI |
| `Olympus` | Olympus |
| `Caravel` | Caravelle |

## Exemples

```text
polar.html?b=Class_40&o=FP&ts=16&ta=110&th=dark&level=expert&layout=focus

energyEn.html?b=Imoca&o=WMJP&ts=18.5&se=60&th=light

pena.html?b=Class_40&ts=16&se=70&bs=12&rentWind=20&withoutSpeed=12&withSpeed=14

autoSail.html?b=Class_40&o=FP&ts=16&ta=110&s=C0&firstOverlapSail=C0&secondOverlapSail=LJ&precision=0.1
```

Le dernier exemple choisit LJ comme deuxième voile de recouvrement. L’existence
d’une zone dépend du bateau et du couple de voiles ; une paire sans recouvrement
affiche l’état vide prévu par l’outil.

## Vérification

```powershell
pnpm exec playwright test tool-urls.spec.ts tool-entries-build.spec.ts --workers=1
pnpm exec playwright test --workers=1
npm run build
```

Les tests de build servent de vrais fichiers temporaires sur un serveur statique
sans fallback SPA et vérifient aussi le chargement de l’application compilée.
