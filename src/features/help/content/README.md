# Rédiger l’aide ITYC

L’aide affichée dans l’application est rédigée dans les fichiers Markdown des
dossiers `fr/` et `en/`. Un fichier correspond à un document. Les sept documents
historiques conservent leur nom, leur ordre, leurs textes et leurs illustrations.
`nouvelle-interface.md` rassemble les compléments propres à la nouvelle interface.

Modifier directement ces fichiers pour faire évoluer la documentation. Les
changements sont pris en compte par Vite, puis inclus dans `npm run build`.
Le catalogue et les groupes de navigation sont dans `../helpDocuments.ts`.

## Titres et navigation

- `#` : titre du document.
- `##` : grande section, visible dans les deux sommaires.
- `###` : sous-section, visible dans le sommaire de l’article.
- `####` : détail d’une sous-section.

Les titres produisent automatiquement des liens partageables, par exemple
`#aide?article=tuto_pena&section=3-penalites-simples`.
Les commentaires `<!-- anchor:tp_p3 -->` conservent les anciennes ancres HTML.
Ne pas les supprimer lors d’une correction de texte.

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

`migration-report.json` consigne les sections, figures, formules, textes
conservés et anomalies des sources historiques. Les versions FR et EN ne sont
pas toujours équivalentes : ces différences sont conservées et signalées dans
le rapport. Une illustration absente des sources EN est signalée par une note.

Le script `python newSite/scripts/migrate-help.py`, lancé depuis la racine du
dépôt, permet de **réimporter** les HTML historiques. Il vérifie que chaque nœud
de texte utile est consommé exactement une fois. Il réécrit les 14 fichiers
historiques : ne pas le relancer après des modifications éditoriales sans
vouloir les remplacer. Il ne fait pas partie du build.

Vérification du rendu et de la navigation :

```bash
npm exec playwright test help-wiki.spec.ts help-captures.spec.ts --workers=1
```
