# Calcul des voiles automatiques

Une voile peut rester intéressante en mode automatique alors qu’une autre est légèrement plus rapide. ITYC calcule cette marge de maintien, les plages d’utilisation d’une voile et les zones de recouvrement entre deux voiles à partir des polaires du bateau.

Ce chapitre explique les calculs. Le [tutoriel voiles automatiques](#aide?article=tuto_autoSail) présente les réglages et les graphiques.

<!-- anchor:calc-autosail-speeds -->
## 1. Vitesses utilisées pour la comparaison

Pour chaque couple angle au vent (TWA) et vitesse du vent (TWS), ITYC calcule la vitesse de chaque voile avec l’interpolation bilinéaire et les coefficients de coque, de foils et de vitesse du bateau. Ces étapes sont décrites dans le [calcul des polaires](#aide?article=aide_polaire).

La référence est la meilleure vitesse parmi les voiles activées :

$$
v_{max}=\max_{s\in S}v_s
$$

Avec $v_s$ la vitesse de la voile $s$ et $S$ l’ensemble des voiles activées. Le bateau, les voiles disponibles et les options doivent correspondre à la configuration que l’on souhaite étudier.

La voile analysée dans les graphiques est celle choisie dans leur sélecteur. Les autres voiles activées servent à établir la meilleure vitesse concurrente.

<!-- anchor:calc-autosail-tolerance -->
## 2. Tolérance de changement de voile

<!-- anchor:calc-autosail-coefficient -->
### 2.1 Coefficient de maintien

La polaire du bateau peut fournir un coefficient de tolérance $k$. En son absence, ITYC utilise :

$$
k=1{,}014
$$

Ce coefficient correspond à une marge de 1,4 % de la vitesse de la voile analysée. Il sert uniquement à comparer les voiles : il n’augmente pas leur vitesse réelle.

Une voile de vitesse $v_s$ est considérée comme **active**, c’est-à-dire pouvant être maintenue dans la plage automatique calculée, lorsque :

$$
v_s>0\qquad\text{et}\qquad k\times v_s>v_{max}
$$

Le test est strict. À l’égalité $k\times v_s=v_{max}$, la voile ne fait plus partie de la plage active calculée.

<!-- anchor:calc-autosail-example -->
### 2.2 Exemple numérique

Avec une voile analysée à 10 nœuds et $k=1{,}014$, le seuil de comparaison vaut 10,14 nœuds.

| Meilleure vitesse concurrente | Résultat du calcul |
| --- | --- |
| 10,13 nœuds | La voile à 10 nœuds reste active : sa marge autorise son maintien |
| 10,14 nœuds | La voile à 10 nœuds n’est plus active : le seuil est atteint |
| 10,15 nœuds | La voile à 10 nœuds n’est plus active : la meilleure voile dépasse le seuil |

Cette marge crée des conditions dans lesquelles plusieurs voiles peuvent rester actives. La voile réellement portée dépend alors de la situation précédente ; le seul couple TWA/TWS ne suffit pas à désigner une voile unique.

<!-- anchor:calc-autosail-curves -->
## 3. Courbes à TWA fixe ou à TWS fixe

Les deux premiers graphiques font varier une condition en maintenant l’autre constante :

| Graphique | Paramètre fixe | Axe horizontal |
| --- | --- | --- |
| Voile active · TWA fixe | Angle au vent | Vitesse du vent, en nœuds |
| Voile active · TWS fixe | Vitesse du vent | Angle au vent, en degrés |

Le calcul avance par pas de 0,1 ou 0,01 nœud sur l’axe TWS, selon le bouton de précision de la courbe. Sur l’axe TWA, le pas reste de 0,1°. À chaque point de l’intervalle choisi, il détermine $v_s$, $v_{max}$, la meilleure voile et le respect du seuil de maintien.

<!-- anchor:calc-autosail-series -->
### 3.1 Signification des courbes Auto, Theo et Manu

| Courbe | Valeur représentée |
| --- | --- |
| Theo | Meilleure vitesse $v_{max}$, avec la couleur de la meilleure voile théorique |
| Manu | Vitesse $v_s$ de la voile analysée, conservée pour toutes les conditions |
| Auto | Même ordonnée $v_{max}$ que Theo ; les couleurs et pointillés signalent où la voile analysée peut être maintenue malgré une meilleure voile |

Dans une zone de recouvrement, la courbe **Auto** utilise la couleur de la voile analysée en pointillés. L’écart de vitesse indiqué dans l’infobulle vaut :

$$
\Delta v=v_{max}-v_s
$$

L’ordonnée de la courbe Auto est une référence de performance théorique. Pour connaître la vitesse de la voile conservée dans cette zone, lire **Manu** ; le coefficient de tolérance ne transforme pas sa vitesse en $v_{max}$.

<!-- anchor:calc-autosail-intervals -->
### 3.2 Plages d’utilisation affichées

Les intervalles regroupent les points consécutifs où le test de maintien est satisfait. Plusieurs plages séparées peuvent apparaître si la voile cesse d’être active puis le redevient.

Les bornes correspondent aux points échantillonnés : elles ne résultent pas d’une recherche analytique exacte du seuil.

<!-- anchor:calc-autosail-usage -->
## 4. Zone d’utilisation d’une voile

La zone d’utilisation applique le même test à une grille complète de conditions TWA/TWS.

Pour chaque vitesse de vent $w$, le calcul retient les angles auxquels la voile analysée reste active :

$$
U_s(w)=\{\alpha\mid v_s(\alpha,w)>0\ \text{et}\ k\,v_s(\alpha,w)>v_{max}(\alpha,w)\}
$$

Lorsque cet ensemble contient des points, les deux courbes affichées sont :

$$
TWA_{mini}(w)=\min U_s(w),\qquad TWA_{maxi}(w)=\max U_s(w)
$$

Le calcul échantillonne le TWS à partir de 0,1 nœud avec un pas de **0,1 ou 0,01 nœud**, sélectionné par le bouton de précision, et le TWA avec un pas de **0,1°**, dans les bornes de la polaire limitées à 0°–180° et à 50 nœuds.

Un message « Pas de zone d’utilisation » signifie qu’aucun point valide de la grille ne satisfait le test pour la configuration choisie.

<!-- anchor:calc-autosail-overlap -->
## 5. Zone de recouvrement entre deux voiles

Une zone de recouvrement regroupe les conditions dans lesquelles les deux voiles analysées respectent simultanément le seuil de maintien :

$$
U_{s_1,s_2}(w)=U_{s_1}(w)\cap U_{s_2}(w)
$$

Les deux comparaisons utilisent la même meilleure vitesse $v_{max}$, calculée parmi **toutes les voiles activées**. Une troisième voile peut donc réduire ou supprimer le recouvrement du couple étudié.

Comme pour une seule voile, les courbes représentent l’angle minimal et l’angle maximal retenus pour chaque TWS. Il ne suffit pas que deux voiles aient une vitesse proche entre elles : chacune doit rester assez proche de la meilleure voile disponible.

<!-- anchor:calc-autosail-precision -->
### 5.1 Réglage de la précision

| Précision sélectionnée | Pas du TWS | Pas du TWA |
| --- | --- | --- |
| 0,1 | 0,1 nœud | 0,1° |
| 0,01 | 0,01 nœud | 0,01° |

La précision fine peut faire apparaître une bande étroite manquée par la grille plus grossière. Elle demande davantage de calculs, mais ne change ni la polaire, ni le coefficient de tolérance, ni le test de comparaison.

<!-- anchor:calc-autosail-limits -->
## 6. Portée et limites des résultats

Les zones représentent des conditions fixes, sans simulation d’une succession de changements de vent ou de voiles. Elles indiquent où une voile **peut être maintenue**, pas quelle voile le bateau portera nécessairement après un parcours donné.

La représentation des zones conserve uniquement les TWA minimum et maximum pour chaque TWS. Si les points actifs forment plusieurs plages séparées au même TWS, les trous entre ces plages ne sont pas détaillés dans l’enveloppe colorée. Les courbes à TWS fixe permettent d’étudier plus précisément ces cas.

Les frontières dépendent du pas d’échantillonnage et des données disponibles. Un affichage arrondi à plusieurs décimales ne rend pas la limite plus précise que la grille utilisée.

Enfin, le calcul ne retranche pas le ralentissement d’un changement de voile et ne calcule pas sa rentabilité. Pour comparer le gain attendu au coût de la manœuvre, utiliser le [calcul des pénalités](#aide?article=aide_pena) et le [tutoriel de rentabilité](#aide?article=tuto_pena&section=tp_p5).

[Ouvrir les voiles automatiques](autoSail.html) · [Consulter le tutoriel](#aide?article=tuto_autoSail) · [Glossaire](#aide?article=glossaire)
