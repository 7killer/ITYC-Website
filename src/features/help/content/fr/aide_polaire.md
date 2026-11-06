# Calcul des polaires

Les polaires décrivent la vitesse théorique d’un bateau selon le vent, la voile et les équipements. ITYC utilise les mêmes données et le même calcul de vitesse pour les courbes de polaires, la carte des voiles et l’étude des voiles automatiques.

Ce chapitre explique les calculs. Le [tutoriel polaires](#aide?article=tuto_polaire) présente les commandes et la lecture des graphiques.

<!-- anchor:calc-polar-inputs -->
## 1. Données et paramètres du calcul

Pour chaque bateau, les données fournissent une grille d’angles et de vitesses de vent, une table de vitesses par voile et les coefficients des équipements disponibles.

| Symbole | Signification | Unité |
| --- | --- | --- |
| $\alpha$ ou TWA | Angle du bateau par rapport au vent réel | Degrés |
| $w$ ou TWS | Vitesse du vent réel | Nœuds |
| $v_s$ | Vitesse du bateau avec la voile $s$ | Nœuds |
| $S$ | Ensemble des voiles activées dans la barre de sélection | — |

Les calculs comparent uniquement les voiles activées pour désigner la meilleure voile. Modifier ce choix peut donc changer la vitesse maximale, les angles optimaux et les limites entre voiles.

Les angles sont étudiés sur un demi-plan, de 0° à 180° : la polaire représente les deux amures par symétrie.

<!-- anchor:calc-polar-interpolation -->
## 2. Interpolation de la vitesse d’une voile

La table d’une voile ne contient pas une valeur pour chaque couple TWA/TWS. ITYC calcule les valeurs intermédiaires par **interpolation bilinéaire**, à partir des quatre points qui encadrent la condition demandée.

<!-- anchor:calc-polar-interpolation-weights -->
### 2.1 Position entre les points de référence

Si $\alpha_0 \leq \alpha \leq \alpha_1$ et $w_0 \leq w \leq w_1$, on définit :

$$
x=\frac{\alpha-\alpha_0}{\alpha_1-\alpha_0},\qquad
y=\frac{w-w_0}{w_1-w_0}
$$

Les coefficients $x$ et $y$ indiquent la position dans la cellule de la grille, entre 0 et 1.

<!-- anchor:calc-polar-interpolation-speed -->
### 2.2 Combinaison des quatre vitesses

En notant $v_{00}$, $v_{10}$, $v_{01}$ et $v_{11}$ les vitesses aux quatre coins :

$$
v_{interp}=(1-x)(1-y)v_{00}+x(1-y)v_{10}+(1-x)yv_{01}+xyv_{11}
$$

Au milieu des deux intervalles, les quatre valeurs ont le même poids. Sur un point de la grille, on retrouve exactement la valeur de la table.

En dehors des bornes de la table, le calcul conserve la valeur de la borne la plus proche pour l’axe concerné : il n’extrapole pas la vitesse au-delà des données disponibles.

<!-- anchor:calc-polar-options -->
## 3. Coefficients de vitesse et équipements

La vitesse interpolée est multipliée par les coefficients du bateau et des options activées :

$$
v_s=v_{interp}\times C_{global}\times C_{coque}\times C_{foils}
$$

<!-- anchor:calc-polar-hull -->
### 3.1 Coefficient global et polish coque

$C_{global}$ est le coefficient général fourni par la polaire, ou 1 si aucun n’est défini. Le polish utilise le coefficient de coque du bateau lorsqu’il est activé ; sinon, $C_{coque}=1$.

Le réglage **Full pack** active les options et les voiles correspondantes. Il n’ajoute pas un coefficient de vitesse supplémentaire à ceux déjà appliqués.

<!-- anchor:calc-polar-foils -->
### 3.2 Activation progressive des foils

L’effet des foils dépend à la fois du TWA et du TWS. La polaire précise, pour chaque axe, une plage d’efficacité maximale et une largeur de transition de chaque côté.

Pour une valeur $z$, une plage $[a,b]$ et une transition de largeur $m$, l’intensité $A$ vaut :

$$
A(z)=\begin{cases}
0 & z\leq a-m\ \text{ou}\ z\geq b+m \\
\dfrac{z-a+m}{m} & a-m<z<a \\
1 & a\leq z\leq b \\
\dfrac{b+m-z}{m} & b<z<b+m
\end{cases}
$$

Les contributions de l’angle et du vent sont multipliées :

$$
C_{foils}=1+(R_{foils}-1)\times A_{TWA}(\alpha)\times A_{TWS}(w)
$$

$R_{foils}$ est le coefficient maximal fourni par la polaire du bateau. Si les deux intensités valent 1, le gain des foils est maximal. Si l’une vaut 0, leur gain est nul. Des intensités de 50 % sur les deux axes donnent 25 % du gain maximal.

Lorsque les foils sont désactivés ou absents des données du bateau, $C_{foils}=1$.

<!-- anchor:calc-polar-optimum -->
## 4. Meilleure voile, VMG et vitesse maximale

<!-- anchor:calc-polar-best-sail -->
### 4.1 Meilleure voile théorique

À chaque couple TWA/TWS, ITYC calcule la vitesse de chaque voile et retient la plus rapide parmi les voiles activées :

$$
v_{max}(\alpha,w)=\max_{s\in S}v_s(\alpha,w)
$$

La couleur d’un point ou d’un segment indique cette voile. Cette sélection est instantanée : elle ne déduit ni temps de changement de voile ni perte d’énergie.

La marge de maintien d’une voile en mode automatique est étudiée séparément dans le [calcul des voiles automatiques](#aide?article=aide_autoSail).

<!-- anchor:calc-polar-vmg -->
### 4.2 VMG et meilleur angle au vent

La VMG est la projection de la vitesse du bateau sur l’axe du vent :

$$
VMG(\alpha,w)=v_{max}(\alpha,w)\times\cos\left(\frac{\pi\alpha}{180}\right)
$$

Elle est positive au près et négative au portant. Pour chaque TWS, le calcul recherche l’angle qui maximise la VMG au près et celui qui la rend la plus négative au portant. Les graphiques affichent les valeurs de VMG en valeur absolue.

**BVMG** indique les angles correspondants. La courbe **VMG** indique les vitesses utiles obtenues à ces angles. La vitesse réelle du bateau peut être supérieure à sa VMG : seule sa composante dans l’axe du vent contribue à cette dernière.

<!-- anchor:calc-polar-best-speed -->
### 4.3 BSPD et VSPD

La recherche de vitesse maximale compare les vitesses sur tous les angles échantillonnés, pour un TWS donné :

$$
VSPD(w)=\max_{\alpha}v_{max}(\alpha,w)
$$

**BSPD** est le TWA auquel cette vitesse maximale est obtenue ; son unité est le degré. **VSPD** est la vitesse correspondante, en nœuds.

L’angle de vitesse maximale et l’angle de meilleure VMG répondent à deux objectifs différents et ne coïncident pas nécessairement.

<!-- anchor:calc-polar-curves -->
## 5. Construction des courbes et de la carte des voiles

Les courbes de vitesse sont recalculées point par point avec le bateau, les options et les voiles sélectionnés.

| Graphique | Calcul effectué |
| --- | --- |
| Vitesse selon le TWA | Variation du TWA à TWS fixe, avec deux références à TWS − 1 et TWS + 1 nœud |
| Vitesse selon le TWS | Variation du TWS à TWA fixe, avec deux références à TWA − 2° et TWA + 2° |
| BVMG et VMG | Recherche des meilleures VMG au près et au portant pour chaque TWS |
| BSPD et VSPD | Recherche de la vitesse maximale et de son TWA pour chaque TWS |
| Utilisation des voiles | Identification de la voile la plus rapide à chaque point de la grille TWA/TWS |

Les références voisines sont limitées à 0° et 180° pour le TWA et à un minimum de 0,1 nœud pour TWS − 1. Si une référence dépasse la table de polaire, l’interpolation reste bornée aux données.

La carte d’utilisation des voiles représente la meilleure voile théorique, sans marge de maintien automatique. Une frontière de couleur correspond à un changement de voile gagnante, pas nécessairement à une rupture de vitesse.

<!-- anchor:calc-polar-precision -->
## 6. Résolution et limites d’interprétation

Les résultats sont obtenus sur des grilles de calcul. Les valeurs affichées avec plusieurs décimales ne signifient pas que la recherche d’optimum a une résolution aussi fine.

| Calcul | Pas et domaine étudiés |
| --- | --- |
| Vitesse selon le TWA | Pas de 0,1°, à partir de 0° |
| Vitesse selon le TWS | Pas de 0,1 ou 0,01 nœud, à partir de 0,1 nœud |
| Courbes BVMG, VMG, BSPD et VSPD | TWS à partir de 1 nœud, pas de 0,1 ou 0,01 nœud ; recherche du TWA à partir de 1°, pas de 0,1° |
| Carte des voiles | Pas de 0,1 ou 0,01 nœud à partir de 0,5 nœud et de 1° à partir de 0° |

Le bouton placé avant le reset zoom affiche le pas TWS actif. Un clic bascule entre 0,1 et 0,01, indépendamment pour chaque graphique. Le sélecteur TWS du diagramme Expert utilise un pas fixe de 0,01 nœud.

Les limites supérieures sont celles des données du bateau, plafonnées à 50 nœuds et 180°. L’analyseur visuel en mode Expert utilise le même calcul de vitesse mais commence sa recherche angulaire à 0°, avec un pas de 0,1° : une petite différence avec une courbe dérivée peut donc provenir de l’échantillonnage.

Ces vitesses décrivent les performances théoriques pour des conditions fixes. Elles n’intègrent ni les pénalités de manœuvre, ni une évolution future du vent, ni un itinéraire. Pour décider d’un changement de voile, compléter la comparaison par le [calcul des pénalités](#aide?article=aide_pena) et le [calcul d’énergie](#aide?article=aide_energy).

[Ouvrir les polaires](polar.html) · [Consulter le tutoriel](#aide?article=tuto_polaire) · [Glossaire](#aide?article=glossaire)
