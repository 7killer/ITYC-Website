# Tutoriel énergie

<!-- anchor:tp_p1 -->
## 1. Vue d'ensemble de la page
### 1.1 Présentation

Dans Virtual Regatta, comme dans le réel, votre skipper peut être en forme ou fatigué.

Sa jauge d'énergie ou stamina peut varier de 0 à 100%. Le durée du temps de pénalités est multiplié par un facteur de 0,5 à 2. ( voir [ici](https://ityc.fr/aide_pena.html) pour plus de détails ).

ITYC.fr vous propose cette feuille de calcul permettant de calculer les taux de pertes et de récupération d'énergie dépendant des conditions et du bateau.

Après avoir sélectionné un bateau, les données seront visibles.

:::figure rows image=center width=100% blocks=23%,40%,22%,15%
![Pénalités Vue d'ensemble](/assets/help/energy/energy_vueensembleEntete.png)


Sélection du bateau.

---

Sélection des options.

---

Date mise à jour polaire.

---

Mode affichage.

:::

ITYC.FR vous permet d afficher les pages sous 2 formes :
- Mode Focus : une courbe par page , meilleur visibilité.
- Mode Grille : 2 courbe par page, plus compact.

### 1.2  Boutons du graphique

#### 1.2.1 Mode affichage
Vous pouvez changer de mode d'affichage de 2 manières :

* En utilisant le sélecteur en haut de page ![Description](/assets/help/common/focusgrille.png "icon:2.5em")
* En utilisant les boutons de chaque courbe 
  * Passage du mode focus à Grille ![Description](/assets/help/common/modeGrilleCurve.png "icon:2.5em")
  * Passage du mode focus à Grille ![Description](/assets/help/common/modeFocusCurve.png "icon:2.5em")


*Lors du passage d'un mode à l'autre le défilement de la page s'adapte pour garder le focus sur la courbe affichée.*

#### 1.2.2 Reset zoom

Vous pouvez réinitialiser le zoom d' un courbe à tout moment en appuyant sur le bouton ![Description](/assets/help/common/resetZoom.png "icon:2.5em")

#### 1.2.3 Raccourci aide

A tout moment, vous pouvez consulter l' aide du graphique concerné en cliquant sur ce bouton ![Description](/assets/help/common/aide.png "icon:2.5em")

#### 1.2.4 Précision

Pour tous les graphiques dont l' axe X est la TWS, vous pouvez sélectionner la précision du calcul entre 0.1 ou 0.01. 
* Cliquez sur ce bouton ![Description](/assets/help/common/precision10.png "icon:2.5em") , pour basculer le calcul en précision 0.01.
* Cliquez sur ce bouton ![Description](/assets/help/common/precision100.png "icon:2.5em") , pour basculer le calcul en précision 0.1.

*Attention une précision de 0.01 demande plus de temps de calcul.*

<!-- anchor:tp_p1_1 -->
### 1.3 Mode Focus
:::figure side image=left width=75% 
![energie Vue d ensemble focus](/assets/help/energy/energie_vueensemble.png)

Perte d énergie lors d une manoeuvre.

---

Récupération d énergie

:::

<!-- anchor:tp_p1_1_2 -->
### 1.4 Mode Grille

:::figure side image=left width=75% 
![Energie Vue d ensemble grille](/assets/help/energy/energy_vueensemble_g.png)

Perte d énergie lors d une manoeuvre / Récupération d énergie.


:::

<!-- anchor:tp_p2 -->
## 2. Sélection du bateau

:::figure side 
![Sélection du bateau ityc](/assets/help/common/select_boat_ityc.png)
Vous devez sélectionner le bateau à l'aide de la barre de sélection en haut de la page.
:::

:::figure side 
![Sélection du bateau game](/assets/help/common/select_boat_game.png)
Le type de bateau peut être trouvé dans le jeu sur la page des polaires en haut à gauche.
:::

:::figure side
![Sélection du bateau toxxct](/assets/help/common/select_boat_toxcct.png)

Sur les excellents site de [Toxcct by INC](http://inc.bureauvallee.free.fr/polaires/) ou [Toxcct by LSV](https://vro.civis.net/polars), dans la colonne de gauche.
:::

:::figure side width=50%
![Sélection du bateau dash](/assets/help/common/select_boat_dash.png)

Sur notre dashboard, onglet Résumé, section Race details Boat Name.
:::

<!-- anchor:tp_p3 -->
## 3. Sélection des options
Vous devez sélectionner les équipements de votre bateau.

:::figure below width=40%  
![Sélection des options](/assets/help/energy/energie_options.png)

Activer Winch si votre bateau est équipé des Winch Pro.

Activer Enrouleur si votre bateau est équipé du Magic Furler.

Activer Veste si votre bateau est équipé du VRtex Jacket.

Activer Coussin si votre bateau est équipé du Confort Lounge.

:::

<!-- anchor:tp_p4 -->
## 4. Perte d énergie

<!-- anchor:tp_p4_1 -->
### 4.1 Présentation

Combien d'énergie allez vous perdre en effectuant une manoeuvre ou un changement de voile ?

Combien de temps sera nécessaire pour la récupérer ?

Cette section se divise en 2 parties :

 - Mode Focus
:::figure rows image=center width=80% blocks=77%,23%
![Energie perdue focus](/assets/help/energy/el/el_all.png)


Perte d énergie pour chaque type de manoeuvre.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie perdue grille](/assets/help/energy/el/el_all_g.png)


Réglage des paramètres de la courbe et calculatrice.

---

Perte d énergie pour chaque type de manoeuvre.

:::

<!-- anchor:tp_p4_2 -->
### 4.2 Réglages et Calculatrice 

:::figure side image=left  blocks=30%,70%
![Calculatrice energie perdue](/assets/help/energy/el/el_cal.png)

Réglez la vitesse du vent (nds).

---

Obtenez le taux d'énergie perdue pour chaque type de manoeuvre (%)
et le temps nécessaire à la récupération de l'énergie perdue.

*Note: Ces données sont identiques à celles fournies pour la courbe.*

:::
### 4.3 Fonctionnalités des courbes
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/energy/el/el_curve.png)

En vert , Perte d énergie Virement ou empannage

En rouge, Perte d énergie Changement de voile

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une manoeuvre.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/energy/el/el_tooltip.png)

Vitesse du vents ( noeuds ).

---

Pertes d'énergie.
:::

<!-- anchor:tp_p4_3 -->

## 5. Récupération d'énergie

<!-- anchor:tp_p5_1 -->
### 5.1 Présentation

Au bout de quelle durée récupérez vous un point d' énergie (stamina) ?

Combien de temps allez vous mettre pour récupérer votre énergie à 100% ?

Cette section se divise en 2 parties :
 - Mode Focus
:::figure rows image=center width=80% blocks=77%,23%
![Energie perdue focus](/assets/help/energy/er/er_all.png)


Durée nécessaire pour récupérer un point d'énergie.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie recup grille](/assets/help/energy/er/er_all_g.png)


Réglage des paramètres de la courbe et calculatrice.

---

Durée nécessaire pour récupérer un point d'énergie.

:::

<!-- anchor:tp_p5_2 -->
### 5.2 Réglages et Calculatrice 

:::figure side image=left  blocks=25%,25%,50%
![Calculatrice energie recup](/assets/help/energy/er/er_cal.png)

Réglez l énergie (stamina) actuel du skipper (%).

---

Réglez la vitesse du vent (nds).

---
Obtenez le taux d'énergie à récupérer (%), le temps nécessaire de récupération
et le temps de récupération par point d énergie.

*Note: Ces données sont identiques à celles fournies pour la courbe.*

:::
### 5.3 Fonctionnalités des courbes
:::figure side width=60% 
![Courbe de energie recup](/assets/help/energy/er/er_curve.png)

En vert , Temps nécessaire par point d'énergie

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une manoeuvre.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![énergie recup tooltip](/assets/help/energy/er/er_tooltip.png)

Vitesse du vents ( noeuds ).

---

Temps nécessaire par point d'énergie.
:::

<!-- anchor:tp_p5_3 -->
