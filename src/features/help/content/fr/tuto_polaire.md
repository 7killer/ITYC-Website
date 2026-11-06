# Tutoriel polaires

Ce tutoriel présente les commandes et la lecture des graphiques. Pour les formules,
les coefficients et la recherche des meilleures performances, consultez le
[calcul des polaires](#aide?article=aide_polaire).

<!-- anchor:tp_p1 -->
## 1. Vue d'ensemble de la page
### 1.1 Présentation
Les polaires des bateaux permettent connaître la vitesse du bateau en fonction de nombreux paramètres :

- Les options du bateau ( Foils / polish).

- Les voiles disponibles.

- La vitesse du vent ( TWS ).

- L'angle au vent ( TWA ).

De ce fait, elles peuvent être complexe appréhender et il peut être chronophage d'intégrer toutes leurs subtilités.

Les polaires peuvent parfois avoir des "trous", ces conditions où le bateau perd de la vitesse, où n'en gagnent pas ne sont pas toujours simples à détecter sur la représentation "classique" des polaires

ITYC.fr vous propose cette feuille de calcul pour vous permettre d'analyser plus facilement les polaires des bateaux.

Après avoir sélectionné un bateau, les données seront visibles.

:::figure rows image=center width=100% blocks=68%,20%,12%
![Pénalités Vue d'ensemble](/assets/help/polar/entete/polar_entete.png)


Sélection du bateau.

---

Date mise à jour polaire.

---

Mode affichage.

:::
:::figure rows image=center width=100% blocks=36%,52%,12% 


Packs / Options

---

Voiles.

---

Mode polaire.

:::

ITYC.FR vous permet d'afficher les pages sous 2 formes :
- Mode Focus : une courbe par page , meilleur visibilité.
- Mode Grille : 2 courbe par page, plus compact.
### 1.2 Boutons du graphique

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
:::figure side image=left width=75% blocks=12.5%,12.5%,12.5%,12.5%,12.5%,12.5%,12.5%,12.5%
![polaire Vue d ensemble focus](/assets/help/polar/polar_viewall.png)

Analyseur de polaire (Mode Expert).

---

Vitesse du bateau en fonction de la vitesse du vent ( TWS ) pour un angle au vent ( TWA ) fixe.

---

Vitesse du bateau en fonction de l'angle du vent ( TWA ) pour une vitesse du vent ( TWS ) fixe.

---

Angle au vent ( TWA ) à la meilleure VMG en fonction de la vitesse du vent ( TWS ) à la meilleure VMG.

---

Vitesse du bateau VMG en fonction de la vitesse du vent ( TWS ).

---

Angle au vent ( TWA ) pour la meilleure vitesse en fonction de la vitesse du vent ( TWS ).

---

Meilleure vitesse du bateau en fonction de la vitesse du vent ( TWS ).

---

Carte d'utilisation des voiles (TWS, TWA).

:::

<!-- anchor:tp_p1_1_2 -->
### 1.4 Mode Grille Normal

:::figure side image=left width=65% 
![polaire Vue d ensemble grille](/assets/help/polar/polar_viewall_g.png)


Vitesse du bateau en fonction de la vitesse du vent ( TWS ) pour un angle au vent ( TWA ) fixe.

Vitesse du bateau en fonction de l'angle du vent ( TWA ) pour une vitesse du vent ( TWS ) fixe.

---

Angle au vent ( TWA ) à la meilleure VMG en fonction de la vitesse du vent ( TWS ) à la meilleure VMG.

Vitesse du bateau VMG en fonction de la vitesse du vent ( TWS ).

---
Angle au vent ( TWA ) pour la Meilleure vitesse en fonction de la vitesse du vent ( TWS ).

Meilleure vitesse du bateau en fonction de la vitesse du vent ( TWS ).

---

Carte d'utilisation des voiles ( TWS, TWA ).

:::

<!-- anchor:tp_p1_1_2 -->
### 1.2 Mode Grille Expert


:::figure side image=left width=65% blocks=10%,15%,15%,20%,20%,20%
![polaire Vue d ensemble grille](/assets/help/polar/polar_viewall_g_e.png)

Analyseur de polaire (Mode Expert) .

---

Vitesse du bateau en fonction de la vitesse du vent ( TWS ) pour un angle au vent ( TWA ) fixe.

---

Vitesse du bateau en fonction de l'angle du vent ( TWA ) pour une vitesse du vent ( TWS ) fixe.

---

Angle au vent ( TWA ) à la meilleure VMG en fonction de la vitesse du vent ( TWS ) à la meilleure VMG.

Vitesse du bateau VMG en fonction de la vitesse du vent ( TWS ).

---
Angle au vent ( TWA ) pour la Meilleure vitesse en fonction de la vitesse du vent ( TWS ).

Meilleure vitesse du bateau en fonction de la vitesse du vent ( TWS ).

---

Carte d'utilisation des voiles ( TWS, TWA ).

:::

## 2. Mode Normal / Expert

:::figure side width=20%
![polaire Mode Nomal Expert](/assets/help/polar/entete/polar_enteteMode.png)

* En mode Normal, vous retrouvez l affichage classique d'ITYC.

* En mode Expert, apparait sur la page l' analyseur de polaire. (Voir Chapitre dédié).

:::

<!-- anchor:tp_p2 -->
## 3. Sélection du bateau

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
## 4. Sélection des options
:::figure rows image=center width=100% blocks=41%,59%
![Présentation](/assets/help/polar/entete/polar_enteteOptions.png)


La zone permettant de gérer les options et packs.

---

La zone permettant l activation / désactivation de chaque voile.

:::

### 4.1 Options et Packs

:::figure rows image=center width=70% 
![Options et Packs](/assets/help/polar/entete/polar_entetePack.png)


- **Full pack** : Active toutes les options et voiles en 1 clique!

---

- **Foils** : Active / Désactive les foils.

---

- **Polish coque** : Active / Désactive l'option polish.

:::
:::figure rows image=center width=70% blocks=41%,59%


- **Voiles de brise** : Active / Désactive le pack option voiles de brise ( HG / SS ).

---

- **Voile reaching** : Active / Désactive le pack option voile reaching ( C0 ).

---

- **Voiles petit temps** : Active / Désactive le pack option voiles petit temps ( LG / LJ ).

:::

### 4.2 Voiles

:::figure rows image=center width=70%
![Voiles](/assets/help/polar/entete/polar_enteteVoile.png)

Dans cette section , vous pouvez activer / désactiver indépendamment chaque voile.

Pour rappel, l'abréviation du nom anglais de la voile figure entre parenthèses pour une plus grande facilité d'utilisation.
:::

## 5. Analyseur de polaire

### 5.1 Présentation

L analyseur propose un outil permettant d'afficher la totalité de la plage de TWA sous la forme d'un diagramme papillon pour une TWS donnée.

Vous pouvez visualiser l usage des foils, l'enveloppe de chaque voile, ainsi que les limites de la voile active ( avec ou sans voile automatique) ainsi que les best VMG et la best Speed.

En mode focus :
:::figure rows image=center width=80% blocks=50%,25%,25%
![polaire focus expert](/assets/help/polar/curve/polar_expert_All.png)


Diagramme des polaires.

---

Réglage des paramètres de la courbe et infos polaires.

---

Infos polaires complémentaire.

:::

En mode grille :
:::figure rows image=center width=80% blocks=65%,35%
![polaire focus expert](/assets/help/polar/curve/polar_expert_All_g.png)


Diagramme des polaires.

---

Réglage des paramètres de la courbe et infos polaires.

:::
### 5.2 Réglages
:::figure side image=left  blocks=25%,35,40%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_expert_setting.png)


Sélecteur d'affichage.

---

Angle au vent moyen TWA ( ° ).

*Note: La TWA peut aussi être choisi en cliquant sur le diagramme.*

---

Réglez la vitesse du vent (nds).

:::

#### 5.2.1 Sélecteur d'affichage 
:::figure side image=left  width=32%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_expert_setting_diag.png)


**Toutes** Affiche l'enveloppe des voiles.

**Foils** Affiche l'arc d usage des foils et les infos dans le curseur de TWA.

**Voiles Auto** Affiche les limites de la voile active en tenant compte du coefficient de survitesse.

:::

### 5.3 Infos polaire
:::figure side image=left  width=32% blocks=40%,35%,25%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_expert_infos1.png)


Pour la TWA et TWS sélectionnez , retrouvez :
* TWA (°).
* Vitesse du bateau (nds).
* VMG (nds).
* Meilleure voile.

---

Pour la TWS sélectionnez , retrouvez les infos Best Speed :
* TWA (°).
* Vitesse du bateau (nds).
* Voile.

---

Pour la TWS sélectionnez , retrouvez les infos Best VMG :
* Au près , TWA (°) et la vitesse du bateau (nds).
* Au portant , TWA (°) et la vitesse du bateau (nds). 

:::
:::figure side image=left  width=32% blocks=32%,68%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_expert_infos2.png)


Pour la voile active , retrouvez les plages de TWS et de TWA

---

Pour la TWS sélectionnez , retrouvez pour chaque voile  :
* La vitesse du bateau (nds).
* La VMG (nds).

*Note1 : la voile active s affiche en gras.*

*Note2 : Si une voile est en recouvrement, la vitesse de la voile recouverte est affichées entre parenthèses si la fonctionnalités voiles auto est activée.*

:::

### 5.4 Fonctionnalités des courbes

:::figure side image=left  width=32% 
![Calculatrice energie perdue](/assets/help/polar/curve/polar_expert_Curve.png)

1
* Le curseur TWA s affiche de la couleur de la voile.
* A son extrémité , retrouvez la TWA actuelle , la vitesse du bateau, la voile active et le pourcentage d activation des foils.
* Vous pouvez le déplacer en cliquant sur la courbe ou en maintenant le click dessus en en déplaçant votre souris ou en utilisant le curseur.

---
2
 * 2 curseurs de la couleur de la voile active s affiche de la couleur de la voile active.

---
3
* La zone bleu représente la zone d'activation des foils.


---

4
* Les zones rouges représentent les zones hors VMG
* Les tirets rouges représentent les Best VMG au près et au portant.


:::
* Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.
* Avec la molette de votre souris, vous pouvez zoomer sur la courbe.
* En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.
* Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.


## 6. Vitesse du bateau - f(tws) à TWA fixe
### 6.1 Présentation
Après avoir sélectionner vos équipements, vous devez régler l angle au vent ( TWA ) à l'aide la zone en à droite du graphique.

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_twa_curve.png)
:::

### 6.2 Réglages
:::figure side image=left  width=30%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_tws_curve_set.png)

Réglez la vitesse du vent (nds).

:::

### 6.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_twa_curve.png)

3 courbes s'affichent par défaut, celle à la TWS choisi, ainsi que à TWS + 1 , TWS - 1.

---

La couleur de la courbe correspond à la meilleure voile à la vitesse de vent TWS donnée.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_twa_tooltip.png)

Angle au vent ( ° ).

---

A la TWS, La vitesse du bateau (nds ) et la voile active.

---

A la TWS -1 et la TWS + 1 , La vitesse du bateau (nds ), la différence de vitesse avec la courbe TWS et la voile active.

:::


## 7. Vitesse du bateau - f(twa) à TWS fixe
### 7.1 Présentation
Après avoir sélectionner vos équipements, vous devez régler la vitesse du vent (TWS) à l'aide la zone en à droite du graphique.

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_tws_curve.png)
:::

### 7.2 Réglages
:::figure side image=left  width=30%
![Calculatrice energie perdue](/assets/help/polar/curve/polar_tws_curve_set.png)

Réglez l'angle au vent (°).

:::

### 7.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_tws_curve.png)

3 courbes s'affichent par défaut, celle à la TWA choisi, ainsi que à TWA + 2 , TWA - 2.

---

La couleur de la courbe correspond à la meilleure voile à l'angle au vent TWA donnée.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_tws_tooltip.png)

Vitesse du vent ( nds ).

---

A la TWA, La vitesse du bateau (nds ) et la voile active.

---

A la TWA - 2 et la TWA + 2 , La vitesse du bateau (nds ), la différence de vitesse avec la courbe TWA et la voile active.

:::

## 8. Angle au vent BestVMG - f(tws) TWA pour la meilleure VMG 
### 8.1 Présentation


Après avoir sélectionner vos équipements, la courbe des meilleures VMG apparaîtra.

Vous y trouverez la VMG ( Velocity Made Good ) au près et au portant en fonction de la vitesse vent.

La VMG est la composante de vitesse utile dans l’axe du vent : elle décrit la progression, pas uniquement la vitesse sur l’eau.

Vous y trouverez l'angle au vent ( TWA ) pour obtenir la meilleure VMG en fonction de la vitesse vent (TWS).

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_bvmg_curve.png)
:::

### 8.2 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_bvmg_curve.png)

La courbe de TWA pour obtenir le meilleur angle au vent au près ( Best VMG UP ) et la courbe de TWA pour obtenir le meilleur angle au vent au portant ( Best VMG DW )  en fonction de la TWS.

---

La couleur de la courbe correspond à la meilleure voile à la TWS / TWA données.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_bvmg_curve_tooltip.png)

Vitesse du vent ( nds ).

---

A la TWS, La TWA best VMG DW, la vitesse du bateau (nds ) et la voile active.

---

A la TWS, La TWA best VMG UP, la vitesse du bateau (nds ) et la voile active.

:::


## 9. Vitesse du bateau VMG - f(tws) Vitesse du bateau à la meilleure VMG
### 9.1 Présentation

Après avoir sélectionner vos équipements, la courbe des TWA pour la vitesse apparaîtra.

Vous y trouverez la VMG au près et au portant en fonction de la vitesse vent.

La VMG est la composante de vitesse utile dans l’axe du vent : elle décrit la progression, pas uniquement la vitesse sur l’eau.

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_vmg_curve.png)
:::

### 9.2 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_vmg_curve.png)

La courbe de VMG au près ( VMG UP ) et la courbe de VMG au portant ( VMG DW )  en fonction de la TWS.

---

La couleur de la courbe correspond à la meilleure voile à la TWS / TWA données.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_vmg_curve_tooltip.png)

Vitesse du vent ( nds ).

---

A la TWS, La VMG DW, l angle au vent (TWA °), vitesse du bateau ( nds ) et la voile active.

---

A la TWS, La VMG UP, l angle au vent (TWA °), la vitesse du bateau ( nds ) et la voile active.

:::


## 10. Angle au vent BestSpeed - f(tws) TWA pour la meilleure vitesse 
### 10.1 Présentation

Après avoir sélectionner vos équipements, la courbe des TWA pour la vitesse apparaîtra.

Vous y trouverez la TWA  pour obtenir le meilleure vitesse au près et au portant en fonction de la vitesse vent.

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_bspd_curve.png)
:::

### 10.2 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_bspd_curve.png)

La courbe de la TWA pour obtenir la meilleure vitesse du bateau (best speed) en fonction de la TWS.

---

La couleur de la courbe correspond à la meilleure voile à la TWS / TWA données.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_bspd_curve_tooltip.png)

Vitesse du vent ( nds ).

---

A la TWS, La TWA pour la Best speed, la vitesse du bateau (nds ) et la voile active.

:::


## 11. Vitesse du bateau BestSpeed- f(tws) Meilleure vitesse du bateau 
### 11.1 Présentation

Après avoir sélectionner vos équipements, la courbe des TWA pour la vitesse apparaîtra.

Vous y trouverez la meilleur vitesse ( vitesse max) du bateau en fonction de la vitesse du vent (TWS).

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_spd_curve.png)
:::

### 11.2 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_spd_curve.png)

La courbe de la bestSpeed en fonction de la TWS.

---

La couleur de la courbe correspond à la meilleure voile à la TWS / TWA données.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side half
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_spd_curve_tooltip.png)

Vitesse du vent ( nds ).

---

A la TWS, La vitesse du bateau ( nds ),  l angle au vent (TWA °),  et la voile active.

:::

## 12. Carte Utilisation des voiles
### 12.1 Présentation

Après avoir sélectionner vos équipements, la courbe des TWA pour la vitesse apparaîtra.

La carte représente les conditions de vent sur deux axes : TWS horizontalement et TWA verticalement. Chaque zone colorée correspond à la voile la plus rapide parmi les voiles sélectionnées pour ces conditions. Les couleurs sont les mêmes que dans les courbes.
* Lire la carte
La carte représente les conditions de vent sur deux axes : TWS horizontalement et TWA verticalement. Chaque zone colorée correspond à la voile la plus rapide parmi les voiles sélectionnées pour ces conditions. Les couleurs sont les mêmes que dans les courbes.

* Contours de vitesse
Les lignes et leurs étiquettes indiquent des niveaux de vitesse du bateau. Elles aident à repérer les zones où la vitesse change vite ou reste similaire malgré un changement de vent.

:::figure rows image=center width=80%
![Energie perdue focus](/assets/help/polar/curve/polar_bsail_curve.png)
:::

### 12.2 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/polar/curve/polar_bsail_curve.png)

La carte d utilisation des voiles en fonction de la twa et de la TWS.

---

La couleur de la courbe correspond à la meilleure voile à la TWS / TWA données.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side width=30%
![pertes d'énergie tooltip](/assets/help/polar/curve/polar_bsail_curve_tooltip.png)

TWS Vitesse du vent ( nds ).

---

TWA Angle au vent ( ° ).

---

Voile et vitesse du bateau.

:::

