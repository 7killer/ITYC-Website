# Calcul des temps de pénalités

<!-- anchor:tp_p1 -->
## 1. Courbe des pénalités

Comme dans la réalité , les temps de manoeuvres et de changements de voile sont variables dans Virtual Regatta, dépendant de la force du vent et du bateau utilisé.

Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/115001441474) , on retrouve les différents de temps de manoeuvres pour chaque bateau ainsi que la courbe suivante :

:::figure below width=80%
![1. Courbe des pénalités](/assets/help/penalties/tuto/pena_ref_curve_vr.png)
:::

De manière générale , le temps de manoeuvre $T_m$ est égale :

- au temps minimal de manoeuvre $T_{min}$ si la vitesse du vent (TWS) est inférieure à 10 nds,

- au temps maximal de manoeuvre $T_{max}$ si la vitesse du vent (TWS) est supérieure à 30 nds,

- au résultat du calcul suivant :

  $$
  T_m(tws) ={( {{(T_{max} - T_{min}) \times f(tws)}\over 100} + T_{min})\times C_{stamina}\times C_{MagicFurler}}
  $$

   Avec :

  - $T_m(tws)$ : Temps de manoeuvre

  - $T_{min}$ : Temps minimal de manoeuvre

  - $T_{max}$ : Temps maximal de manoeuvre

  - $f(tws)$ : Contribution normalisé de 0 à 100% de la courbe de référence

  - $C_{stamina}$ : Coefficient multiplicateur de la stamina de 0,5 à 2

  - $C_{MagicFurler}$ : Coefficient multiplicateur de l option MagicFurler de 0,8 à 1

Le résultat ne peut pas être inférieur à $T_{min}$.

<!-- anchor:tp_p2 -->
## 2. Courbe de référence $ f(tws)$

Grâce à de nombreuses mesures éffectuées dans le jeu et au support de la communauté, la courbe fournie par VR a pu être modélisé avec l équation suivante.

$$
f(tws) = {50 - {cos({{{tws - 10} \over {30 - 10}}\times\pi})} \times 50}
$$

 Avec :

- $f(tws)$ : Contribution normalisé de 0 à 100% de la courbe de référence

- $tws$ : vitesse du vent en nds

<!-- anchor:tp_p3 -->
## 3. Coefficient multiplicateur de la stamina $ C_{stamina}$

Comme sur un bateau reel , l état de forme du skipper joue sur le temps nécessaire pour effectuer une manoeuvre.

C 'est pour tenir compte de cet aspect que Virtual Regatta a introduit l'énergie du skipper ( ou stamina ) comme paramètre.

Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant l impact de l état de forme sur le temps de manoeuvre représenté par cette courbe:

:::figure below
![3. Coefficient multiplicateur de la stamina $ C_{stamina}$](/assets/help/penalties/tuto/pena_ref_curve_stamina_vr.png)
:::

On peut donc calculer le coefficient multiplicateur de la stamina en fonction de l'état de forme du skipper $Energie_{skipper}$ grâce à l équation suivante :

$$
C_{stamina} ={ Energie_{skipper} \times -0,015 + 2 }
$$

Si l énergie du skipper est supérieure à 100%, elle normalisé à 100% pour ce calcul.


<!-- anchor:tp_p4 -->
## 4. Option Enrouleur / Magic Furler $C_{MagicFurler}$
En cas de changement si votre bateau est équipé de l'option enrouleur magique ("Magic Furler"), un coefficient de réduction de temps de manoeuvre doit être appliqué. 
$$
C_{MagicFurler} ={ 0,8 }
$$
Sinon , on fixe le coefficient à 1,0
$$
C_{MagicFurler} ={ 1,0 }
$$

Grâce à ces différentes équations ainsi qu'aux valeurs de références des différentes manoeuvres contenues dans les polaires du jeu, **ITYC.fr** est en mesure de calculer pour chaque 1/10ème de noeuds de vent, la valeur de la pénalité qui sera appliquée pour tous les types de bateaux.
