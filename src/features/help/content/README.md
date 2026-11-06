# Rédiger l’aide ITYC

L’aide affichée dans l’application est rédigée dans les fichiers Markdown des
dossiers `fr/` et `en/`. Un fichier correspond à un document. Les sept documents
historiques conservent leur nom et leurs ancres ; leur contenu et leur mise en
page peuvent évoluer, avec le français comme référence pour la traduction.
`glossaire.md` rassemble les définitions des termes de navigation et des outils.
`aide_polaire.md` et `aide_autoSail.md` expliquent les calculs des courbes à partir
des workers et du moteur de vitesse du site, en complément des tutoriels illustrés.
`nouvelle-interface.md` est conservé comme archive et n’est plus au catalogue.

Modifier directement ces fichiers pour faire évoluer la documentation. Les
changements sont pris en compte par Vite, puis inclus dans `npm run build`.
Le catalogue et les groupes de navigation sont dans `../helpDocuments.ts`.

## Recherche et glossaire

La recherche porte sur le texte de chaque section des documents du catalogue,
dans la langue active. Elle ignore la casse, les accents et l’ordre des mots,
et affiche les sections les plus pertinentes avec un extrait de leur contenu.
Les chemins des images, les URL, les commentaires et les options de mise en page
ne font pas partie du texte recherché.

Le glossaire utilise un titre `##` par terme, classé alphabétiquement. Chaque
définition donne les variantes usuelles du terme ou de l’abréviation, les unités
éventuelles et un lien vers les explications détaillées. Conserver les mêmes
concepts dans les versions FR et EN et une ancre commune avant chaque titre,
par exemple `<!-- anchor:glossary-twa -->`, pour partager un lien stable dans les
deux langues : `#aide?article=glossaire&section=glossary-twa`.

Déclarer `original: false` dans le catalogue pour un nouveau document sans page
historique. Le champ `tool` peut être omis pour un document transversal.

Pour les chapitres de calcul, vérifier les formules et les pas de balayage dans
`polar/engine/polarCalculator.worker.ts`, `polar/engine/polarSailMap.worker.ts`,
`polar/engine/polarMath.ts` et `autosail/autoSailZone.worker.ts` (chemins relatifs
à `src/features/`). Les courbes à angle ou vent fixe des voiles automatiques
sont construites dans `autosail/AutoSailPage.tsx` avec le même moteur de vitesse.
Conserver les mêmes ancres et la même structure en français et en anglais.

## Titres et navigation

- `#` : titre du document.
- `##` : grande section, visible dans les deux sommaires.
- `###` : sous-section, visible dans le sommaire de l’article.
- `####` : détail d’une sous-section.

Les titres produisent automatiquement des liens partageables, par exemple
`#aide?article=tuto_pena&section=3-penalites-simples`.
Les commentaires `<!-- anchor:tp_p3 -->` conservent les anciennes ancres HTML.
Ne pas les supprimer lors d’une correction de texte.

Chaque titre `##`, `###` ou `####` doit avoir un commentaire d’ancre sur la ligne
immédiatement précédente, sans ligne vide entre le commentaire et le titre :

```markdown
<!-- anchor:tp_p4 -->
## 4. Pénalités simples
```

Une ancre doit être unique dans son document et identique pour les titres
correspondants en français et en anglais. Lors d’un déplacement de section,
déplacer son commentaire avec elle ; conserver son identifiant même si son titre
ou son numéro change. Pour une nouvelle section, choisir un identifiant descriptif
stable, par exemple `polar-expert-grid`, puis le reprendre dans les deux langues.
Un commentaire isolé ou séparé du titre par une ligne vide ne crée aucune ancre.

La recherche utilise cette ancre stable lorsqu’elle est présente. Les liens
générés à partir du titre restent également disponibles. Le test
`tests/visual/help-anchors.spec.ts` vérifie l’ensemble des titres, l’unicité des
ancres, leur correspondance FR/EN et les destinations des liens internes.

Les liens entre les anciens fichiers d’aide sont redirigés vers les documents
du wiki. Les listes imbriquées, tableaux Markdown et expressions mathématiques
`$…$` ou blocs `$$` sont pris en charge.

## Choisir la largeur d’un tableau

Encadrer un tableau Markdown avec `:::table width=60% align=center` pour régler
sa largeur par rapport au contenu de l’article et le centrer :

```markdown
:::table width=60% align=center
| Manoeuvre | Taux de pertes |
| --- | --- |
| Virement | 10% |
| Empannage | 10% |
| Changement de voile | 20% |
:::
```

La largeur doit être supérieure à 0 et inférieure ou égale à 100 %.
`align=left` (par défaut), `align=center` ou `align=right` règle son alignement.
Sans ce bloc, les tableaux occupent 100 % de la largeur du contenu.
Le défilement horizontal reste disponible si les cellules sont trop larges.

## Insérer une icône dans le texte

Ajouter le titre `"icon"` à une image Markdown pour l'afficher dans la ligne de
texte, avec une hauteur de `1em` :

```markdown
Choisir le bateau avec ![Sélection du bateau](/assets/help/common/select_boat_ityc.png "icon").
```

Pour choisir sa hauteur, utiliser `"icon:1.2em"` :

```markdown
Cliquer sur ![Sélection du bateau](/assets/help/common/select_boat_ityc.png "icon:1.2em") pour changer de bateau.
```

La hauteur est relative à la taille du texte environnant : `0.8em`, `1em`,
`1.5em`, etc. Utiliser un nombre positif avec un point pour les décimales.
La largeur s'adapte pour conserver les proportions de l'image. Les icônes
fonctionnent aussi dans les listes, les tableaux, les liens et le texte en gras.
Elles n'ajoutent ni cadre ni lien d'agrandissement automatique. Leur description
entre crochets sert de texte alternatif ; la laisser vide pour une image
purement décorative. Les variantes PNG/JPEG `_b` sont sélectionnées en thème
sombre lorsqu'elles existent, comme pour les captures.

Une image sans titre `icon` reste une capture normale. Une taille invalide ou
nulle n'active pas le mode icône.

## Associer une capture à ses explications

```markdown
:::figure side
![Calculatrice de pénalité simple](/assets/help/penalties/PS/pena_simple_cal.png)

Explication de la partie supérieure.

---

Explication de la partie inférieure.
:::
```

`side` place une capture étroite à gauche du texte. Les séparateurs `---`
créent des groupes d’explications ; pour une capture étroite, leur hauteur est
alignée sur celle de l’illustration, comme dans les calculatrices d’origine.
`side half` répartit l’espace par moitié (infobulles et réglages).
`side wide` réserve trois quarts de la largeur à la capture (vues d’ensemble).
`below` place la capture sur toute la largeur, puis le texte dessous
(tableaux du Dashboard). Les captures latérales passent au-dessus du texte
sur petit écran. Une capture par bloc facilite l’association des explications.

`below width=80%` limite une capture à 80 % de la largeur du contenu.

### Choisir le côté, la largeur et les hauteurs des blocs

```markdown
:::figure side image=left width=75% blocks=10%,30%,30%,30%
![1. Vue d'ensemble de la page](/assets/help/penalties/pena_vueensemble.png)

Sélection du bateau.

---

Pénalités simples.

---

Rentabilité d'une manoeuvre.

---

Pénalités doubles.
:::
```

| Option | Effet |
| --- | --- |
| `image=left` | Image à gauche, texte à droite. Valeur par défaut. |
| `image=right` | Image à droite, texte à gauche. |
| `width=75%` | Image sur 75 % de la largeur du bloc ; le texte utilise le reste, après l’espace entre les colonnes. |
| `blocks=10%,30%,30%,30%` | Hauteurs des quatre blocs de texte, de haut en bas, en face de l’image. |

Chaque séparateur `---` commence un nouveau bloc. Il faut autant de valeurs que
de blocs, toutes positives, avec un total de 100 %. Sans `blocks`, la répartition
reste automatique. Une liste invalide revient à la répartition automatique.
Les hauteurs sont calculées sur la hauteur affichée de l’image, sans l’étirer.
Un bloc de texte trop rempli peut défiler dans sa zone ; il n’augmente pas la
hauteur de l’ensemble. Pour éviter ce défilement, augmenter son pourcentage
ou raccourcir son texte.
Sur mobile, l’image apparaît au-dessus du texte, et les hauteurs sont automatiques.

Les options peuvent se combiner aux anciens formats `side wide` et `side half`.
Une largeur explicite `width` est prioritaire sur ces formats. Pour `below`,
`width` ajuste uniquement la capture ; le texte conserve toute la largeur.

### Image sur une ligne, textes côte à côte sur la suivante

```markdown
:::figure rows image=center width=80% blocks=20%,30%,50%
![Présentation](/assets/help/penalties/PS/pena_simple_all.png)

Texte du premier bloc.

---

Texte du deuxième bloc.

---

Texte du troisième bloc.
:::
```

Le mode `rows` crée deux lignes : l’image, puis les blocs de texte répartis
sur exactement la même largeur. `image=left`, `image=center` ou `image=right`
aligne l’ensemble dans le contenu. `width=80%` donne la largeur de cet ensemble.

Dans ce mode, `blocks=20%,30%,50%` définit les **largeurs** des blocs, de gauche
à droite. Sans cette option, les blocs ont tous la même largeur. Comme pour
`side`, une liste doit avoir autant de valeurs positives que de blocs, avec
un total de 100 %. Une liste invalide utilise des largeurs égales.

Les blocs sont toujours séparés par `---`. Leur hauteur s’adapte librement
au texte. Sur mobile, ils s’empilent sous l’image.

### Ajouter une rangée de textes sans répéter l’image

Après un premier bloc `rows` contenant l’image et ses explications, ajouter
un second bloc `rows` sans image :

```markdown
:::figure rows image=center width=100% blocks=23%,40%,22%,15%
Texte de la deuxième rangée, première colonne.

---

Texte de la deuxième rangée, deuxième colonne.

---

Texte de la deuxième rangée, troisième colonne.

---

Texte de la deuxième rangée, quatrième colonne.
:::
```

Chaque bloc `rows` définit une rangée indépendante. Répéter la même largeur
`width` et le même alignement `image` pour aligner les rangées. Le nombre de
colonnes et leurs largeurs `blocks` peuvent être différents d’une rangée à
l’autre. Sur mobile, les textes s’empilent dans leur ordre d’écriture.

### Deux images sur la même ligne

Dans un bloc `rows`, écrire les images l’une après l’autre, avant les textes :

```markdown
:::figure rows image=center width=100%
![Première capture](/assets/help/penalties/PS/pena_simple_all.png)
![Deuxième capture](/assets/help/penalties/PD/pena_double_all.png)
:::
```

Les deux images se partagent également la largeur disponible, avec un espace
entre elles, et conservent leurs proportions. `width` règle la largeur totale
du groupe. Les variantes sombres et les liens d’agrandissement restent actifs.
Sur mobile, les images s’empilent dans leur ordre d’écriture.

Des textes peuvent suivre les images, séparés par `---` comme dans l’exemple
précédent. L’option `blocks` règle leur largeur sous le groupe d’images.

Référencer la variante claire du fichier. Si une variante `_b` existe dans
`public/assets/help/`, elle est choisie automatiquement en thème sombre.
Chaque capture est un lien ouvrant le fichier à sa taille d’origine.

## Provenance et contrôle de la migration

`migration-report.json` consigne l’état de l’import initial : sections, figures,
formules, textes conservés et anomalies des sources historiques. Les contenus
anglais du catalogue sont désormais alignés sur les documents français, qui
servent de référence pour leur structure, leurs calculs et leurs illustrations.
Le rapport historique ne décrit pas ces mises à jour éditoriales. Lorsqu’une
capture récente n’existe qu’en français, elle est conservée avec une légende et
des explications en anglais.

Le script `python newSite/scripts/migrate-help.py`, lancé depuis la racine du
dépôt, permet de **réimporter** les HTML historiques. Il vérifie que chaque nœud
de texte utile est consommé exactement une fois. Il réécrit les 14 fichiers
historiques : ne pas le relancer après des modifications éditoriales sans
vouloir les remplacer. Il ne fait pas partie du build.

Vérification du rendu et de la navigation :

```bash
npm exec playwright test help-wiki.spec.ts help-captures.spec.ts help-content-parity.spec.ts --workers=1
```
