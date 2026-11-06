# Tutoriel voiles automatiques

Ce tutoriel présente les commandes et la lecture des graphiques. Le chapitre
[calcul des voiles automatiques](#aide?article=aide_autoSail) détaille le seuil de
changement de voile, les plages d’utilisation et les zones de recouvrement.

<!-- anchor:tp_p1 -->
## 1. Vue d'ensemble de la page
### 1.1 Présentation
Grâce à la gestion des voiles automatiques par le jeu, nous n'avons pas à nous préoccuper des changements de voiles à la main.

Les critères de changements sont multiples :

- Les options du bateau ( Foils / polish).

- Les voiles disponibles.

- La vitesse du vent ( TWS ) et ses variations.

- L'angle au vent ( TWA ) et ses variations.

Un coefficient dit de "survitesse" est appliquée à la vitesse de la voile pour éviter les changements de voiles intempestifs.

Dans les faits, en mode "voile automatique" pour que le moteur du jeu change de voile, il faut que la vitesse obtenue avec la nouvelle voile soit supérieure à 1,4% à la vitesse de la voile actuelle.

Il existe donc des zones de recouvrements des voiles.

ITYC.fr vous propose cette feuille de calcul pour vous permettre d'analyser plus facilement les polaires des bateaux.

Après avoir sélectionné un bateau, les données seront visibles.

:::figure rows image=center width=100% blocks=68%,20%,12%
![Pénalités Vue d'ensemble](/assets/help/autosail/entete/autosail_entete.png)


Sélection du bateau.

---

Date mise à jour polaire.

---

Mode affichage.

:::
:::figure rows image=center width=100% blocks=41%,59% 


Packs / Options

---

Voiles.

:::

ITYC.FR vous permet d'afficher les pages sous 2 formes :
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
![polaire Vue d ensemble focus](/assets/help/autosail/autosail_all.png)

Voile active en fonction de la vitesse du vent ( TWS ) pour un angle au vent ( TWA ) fixe.

---

Voile active en fonction de l'angle du vent ( TWA ) pour une vitesse du vent ( TWS ) fixe.

---

Plage d utilisation d'une voile en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ).

---

Zone de recouvrement inter voile en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ).


:::

<!-- anchor:tp_p1_1_2 -->
### 1.4 Mode Grille

:::figure side image=left width=64% 
![polaire Vue d ensemble grille](/assets/help/autosail/autosail_all_g.png)


Voile active en fonction de la vitesse du vent ( TWS ) pour un angle au vent ( TWA ) fixe.


Voile active en fonction de l'angle du vent ( TWA ) pour une vitesse du vent ( TWS ) fixe.

---

Plage d utilisation d'une voile en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ).


Zone de recouvrement inter voile en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ).


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
:::figure rows image=center width=100% blocks=41%,59%
![Présentation](/assets/help/polar/entete/polar_enteteOptions.png)


La zone permettant de gérer les options et packs.

---

La zone permettant l activation / désactivation de chaque voile.

:::

### 3.1 Options et Packs

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

### 3.2 Voiles

:::figure rows image=center width=70%
![Voiles](/assets/help/polar/entete/polar_enteteVoile.png)

Dans cette section , vous pouvez activer / désactiver indépendamment chaque voile.

Pour rappel, l'abréviation du nom anglais de la voile figure entre parenthèses pour une plus grande facilité d'utilisation.
:::

## 4. Voile active - TWA fixe
### 4.1 Présentation
Mon routeur me ferait changer de voile pendant 1h ? On doit passer par une voile intermédiaire, es-ce utile ?

Le coefficient de recouvrement permet t-il de couvrir ces cas, et d'éviter ce changement de voile et les pénalités associées ?

ITYC.fr vous propose cet outil vous permettant en quelques cliques de répondre à ces questions !!!

Cette section se divise en 2 parties :

:::figure rows image=center width=80% blocks=80%,20%
![Energie perdue focus](/assets/help/autosail/curve/autosail_twa_all.png)


Vitesse du bateau pour la plage de TWS et la TWA donnée.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie perdue grille](/assets/help/autosail/curve/autosail_twa_all_g.png)


Réglage des paramètres de la courbe et calculatrice.

---

Vitesse du bateau pour la plage de TWS et la TWA donnée.

:::

### 4.2 Réglages
:::figure side image=left  width=30% blocks=17%,19%,40%,24%
![Calculatrice energie perdue](/assets/help/autosail/curve/autosail_twa_set.png)

Sélectionnez la voile active.

---

Réglez votre TWA ( ° ).

---

Réglez la plage de TWS ( nds ).


---

Obtenez la plage de TWS pour la voile sélectionnée à la TWA choisie.

:::

### 4.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/autosail/curve/autosail_twa_curve.png)

Les courbes représentent la vitesse du bateau en noeuds en fonction de la vitesse du vent à la TWA spécifiée.

La courbe "Theo" représente la meilleure vitesse parmi les voiles équipées, sans tenir compte du coefficient de recouvrement.

La courbe "Auto" reprend cette meilleure vitesse. Sa couleur indique si la voile sélectionnée peut être conservée avec le coefficient de recouvrement, ou quelle voile est la meilleure. Pour connaître la vitesse de la voile sélectionnée, lisez la courbe "Manu".

La courbe Manu représente la vitesse du bateau avec la voile sélectionnée.

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

La partie hachurée correspond à la zone de recouvrement des voiles.


:::figure side
![Courbe de voile](/assets/help/autosail/autoSailZoom.png)

Par exemple,

---

A partir de 1 , le spi (vert clair), recouvrera le code 0 (en vert foncé).

---

Puis une partie du spi lourd ( en rouge foncé) à partir 2.

---

Enfin à partir 3, le changement de voile sera effectif, et le spi lourd sera installé.
:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side width=40% blocks=25%,75%
![pertes d'énergie tooltip](/assets/help/autosail/curve/autosail_twa_tooltip.png)

Vitesse du vents ( noeuds ).

---

Vitesse du bateau ( noeuds ), voile, gain dû au recouvrement par rapport à la courbe théorique le cas échéant.

:::


## 5. Voile active - TWS fixe
### 5.1 Présentation
Mon routeur me ferait changer de voile pendant 1h ? On doit passer par une voile intermédiaire, es-ce utile ?

Le coefficient de recouvrement permet t-il de couvrir ces cas, et d'éviter ce changement de voile et les pénalités associées ?

ITYC.fr vous propose cet outil vous permettant en quelques cliques de répondre à ces questions !!!

Cette section se divise en 2 parties :

:::figure rows image=center width=80% blocks=80%,20%
![Energie perdue focus](/assets/help/autosail/curve/autosail_tws_all.png)


Vitesse du bateau pour la plage de TWA et la TWS donnée.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie perdue grille](/assets/help/autosail/curve/autosail_tws_all_g.png)


Réglage des paramètres de la courbe et calculatrice.

---

Vitesse du bateau pour la plage de TWA et la TWS donnée.

:::

### 5.2 Réglages
:::figure side image=left  width=30% blocks=17%,19%,40%,24%
![Calculatrice energie perdue](/assets/help/autosail/curve/autosail_tws_set.png)

Sélectionnez la voile active.

---

Réglez votre TWS ( nds ).

---

Réglez la plage de TWA ( ° ).


---

Obtenez la plage de TWA pour la voile sélectionnée à la TWS choisie.

:::

### 5.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/autosail/curve/autosail_tws_curve.png)

Les courbes représentent la vitesse du bateau en noeuds en fonction de la TWA à la vitesse du vent spécifiée.

La courbe "Theo" représente la meilleure vitesse parmi les voiles équipées, sans tenir compte du coefficient de recouvrement.

La courbe "Auto" reprend cette meilleure vitesse. Sa couleur indique si la voile sélectionnée peut être conservée avec le coefficient de recouvrement, ou quelle voile est la meilleure. Pour connaître la vitesse de la voile sélectionnée, lisez la courbe "Manu".

La courbe Manu représente la vitesse du bateau avec la voile sélectionnée.

---

La couleur de la courbe correspond à la meilleure voile à un angle au vent TWA donnée.

---

Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une courbe.

---

En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.

---

Avec la molette de votre souris, vous pouvez zoomer sur la courbe.

---

Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.

:::

La partie hachurée correspond à la zone de recouvrement des voiles.

:::figure side
![Courbe de voile](/assets/help/autosail/autoSailZoom.png)

Par exemple,

---

A partir de 1 , le spi (vert clair), recouvrera le code 0 (en vert foncé).

---

Puis une partie du spi lourd ( en rouge foncé) à partir 2.

---

Enfin à partir 3, le changement de voile sera effectif, et le spi lourd sera installé.
:::

Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :

:::figure side width=40% blocks=25%,75%
![pertes d'énergie tooltip](/assets/help/autosail/curve/autosail_tws_tooltip.png)

Vitesse du vents ( noeuds ).

---

Vitesse du bateau ( noeuds ), voile, gain dû au recouvrement par rapport à la courbe théorique le cas échéant.

:::


## 6. Plage d utilisation d'une voile
### 6.1 Présentation
Envie de visualiser la zone d utilisation d'une voile en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ) ?

ITYC.fr vous propose cet outil !!!

Cette section se divise en 2 parties :

:::figure rows image=center width=80% blocks=80%,20%
![Energie perdue focus](/assets/help/autosail/curve/autosail_zu_all.png)


Limite haute et basse de l'angle au vent ( TWA ) pour une voile donnée.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie perdue grille](/assets/help/autosail/curve/autosail_zu_all_g.png)


Réglage des paramètres de la courbe et calculatrice.

---

Limite haute et basse de l'angle au vent ( TWA ) pour une voile donnée.

:::

### 6.2 Réglages
:::figure side image=left  width=30% 
![Calculatrice energie perdue](/assets/help/autosail/curve/autosail_zu_set.png)

Sélectionnez la voile active.

:::

### 6.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/autosail/curve/autosail_zu_curve.png)

Les courbes représentent les limites d angle au vent ( TWA ) min et max en degré en noeuds en fonction de la vitesse du vent pour une voile donnée.

La courbe "Max TWA" représente la limite d'angle au vent ( TWA ) au delà de laquelle la voile devra être changée ( recouvrement inclus ).

La courbe "Min TWA" représente la limite d'angle au vent ( TWA ) en dessous de laquelle la voile devra être changée ( recouvrement inclus ).

---

La couleur de la courbe correspond à la meilleure voile à un angle au vent TWA donnée.

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

:::figure side width=40% blocks=25%,75%
![pertes d'énergie tooltip](/assets/help/autosail/curve/autosail_zu_tooltip.png)


Vitesse du vents ( noeuds ).

---

Angle au vent max ( ° ) , vitesse du bateau ( nds ).

---

Angle au vent min ( ° ) , vitesse du bateau ( nds ).

:::

## 7. Zone de recouvrement entre voile
### 7.1 Présentation
Envie de visualiser la zone de recouvrement entre deux voiles en fonction de la vitesse du vent ( TWS ) et de l'angle au vent ( TWA ) ?

ITYC.fr vous propose cet outil !!!

Cette section se divise en 2 parties :

:::figure rows image=center width=80% blocks=80%,20%
![Energie perdue focus](/assets/help/autosail/curve/autosail_zr_all.png)


Limite haute et basse de l'angle au vent ( TWA ) de recouvrement entre les deux voiles.

---

Réglage des paramètres de la courbe et calculatrice.

:::
 - Mode Grille
:::figure side image=left width=60% blocks=20%,80%
![Energie perdue grille](/assets/help/autosail/curve/autosail_zr_all_g_b.png)


Réglage des paramètres de la courbe et calculatrice.

---

Limite haute et basse de l'angle au vent ( TWA ) de recouvrement entre les deux voiles.

:::

### 7.2 Réglages
:::figure side image=left  width=30% 
![Calculatrice energie perdue](/assets/help/autosail/curve/autosail_zr_set.png)

Sélectionnez la première voile .

---

Sélectionnez la deuxième voile .

:::

### 7.3 Fonctionnalités de la courbe
:::figure side width=60% 
![Courbe de energie perdue](/assets/help/autosail/curve/autosail_zr_curve.png)

Les courbes délimitent une zone d'angle au vent ( TWA )  en fonction de la vitesse du vent pour une voile donnée.

La courbe "Max TWA" représente la limite d'angle au vent ( TWA ) au delà de laquelle la voile changera ( recouvrement inclus ).

La courbe "Min TWA" représente la limite d'angle au vent ( TWA ) en dessous de laquelle la voile changera ( recouvrement inclus ).

---

La couleur de la courbe correspond à la meilleure voile à un angle au vent TWA donnée.

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

:::figure side width=40% blocks=25%,75%
![pertes d'énergie tooltip](/assets/help/autosail/curve/autosail_zr_tooltip.png)


Vitesse du vents ( noeuds ).

---

Angle au vent max ( ° ) , vitesse du bateau ( nds ).

---

Angle au vent min ( ° ) , vitesse du bateau ( nds ).

:::
