# Calcul des pertes et des temps de récupération d'énergie

<!-- anchor:tp_p1 -->
## 1. Pertes d'énergie

Comme dans la réalité , les manoeuvres et de changements de voile sont plus ou moins fatiguant dans Virtual Regatta, dépendant de la force du vent et du bateau utilisé.

Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant la consommation d 'énergie ou stamina pour les différents type de manoeuvres.

:::table width=60% align=center
| Manoeuvre | Taux de pertes |
| --- | --- |
| Virement | 10% |
| Empannage | 10% |
| Changement de voile | 20% |
:::

De manière générale , la perte d'énergie $P_e$ est égale :

- au taux de perte de la maneuvre de base $P_{e_{Base}}$ si la vitesse du vent (TWS) est égale à 0 nds,

- au résultat du calcul suivant :

  $$
  P_e(tws) ={ P_{e_{Base}} \times f_p(tws) \times C_{bateau}}
  $$

   Avec :

  - $P_{e_{Base}}$ : Taux de perte par défaut de la manoeuvre

  - $f_p(tws)$ : Contribution normalisé de 1 à 2 de la courbe de référence des pertes d'énergie

  - $C_{bateau}$ : Coefficient multiplicateur du bateau de 1 à 2

<!-- anchor:tp_p2 -->
## 2. Courbe des pertes d'énergie $ f_p(tws)$

L'influence du vent sur la perte d'énergie ou stamina nous est donnée par la courbe suivante:

:::figure rows image=center width=60%
![2. Courbe des pertes d'énergie $ f_p(tws)$](/assets/help/energy/tuto/el_ref_curve_vr.png)
:::

Cette courbe peut être décomposé en 4 sections.

- De 0 à 10 nds

  $$
  f_p(tws) = {0.02 \times tws + 1}
  $$

- De 10 à 20 nds

  $$
  f_p(tws) = {0.03 \times tws + 0.9}
  $$

- De 20 à 30 nds

  $$
  f_p(tws) = {0.05 \times tws + 0.5}
  $$

- Supérieur à 30 nds

  $$
  f_p(tws) = {2}
  $$

<!-- anchor:tp_p3 -->
## 3. Coefficient multiplicateur du bateau $C_{bateau}$

Comme sur un bateau reel , le type de bateau joue sur le temps nécessaire pour effectuer une manoeuvre.

A ce jour , Virtual Regatta n 'a pas officiellement communiqué le coefficient pour chaque bateau.

Néanmoins, grâce au effort de la communauté, nou savons qu il existe 4 coefficients différents :

$\times 1$ , $\times 1,2$ , $\times 1,5$ , $\times 2$

Après essai , le tableau ci dessous semble faire consensus mais ne peut être garanti.
:::table width=60%  align=center
| Bateau | Coefficient |
| --- | --- |
| Figaro 3 | 1 |
| Class 40 | 1 |
| Imoca | 1,2 |
| Mini 6.50 | 1 |
| Ultim (solo) | 1,5 |
| Ultim (crew) | 1,5 |
| Ocean 50 | 1 |
| Caravelle | 2 |
| Super Maxi 100 | 1,5 |
| Offshore Racer | 1 |
:::
<!-- anchor:tp_p4 -->
## 4. Récupération d'énergie

Comme dans la réalité , plus les conditions de navigations sont calmes, plus votre skipper va récupérer son énergie rapidement.

Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant la récupération d 'énergie ou stamina.

L'influence de la force du vent nous est donnée par la courbe suivante :

:::figure rows image=center width=60%
![4. Récupération d'énergie](/assets/help/energy/tuto/er_ref_curve_vr.png)
:::
De manière générale , le temps pour récupérer un 1% d'energie $T_r$ est égale :

- à $T_r{min}$ = 5 min par point si la vitesse du vent (TWS) est égale à 10 nds,

- à $T_r{max}$ = 15 min si la vitesse du vent (TWS) est supérieure à 30 nds,

- au résultat du calcul suivant :

  $$
  T_r(tws) ={ { { (T_r{max} - T_r{min}) \times f_r(tws)}\over 100}}
  $$

   Avec :

  - $T_r(tws)$ : Temps de récupération

  - $T_r{min}$ : Temps minimal de récupération

  - $T_r{max}$ : Temps maximal de récupération

  - $f_r(tws)$ : Contribution normalisé de 0 à 100% de la courbe de référence


<!-- anchor:tp_p5 -->
## 5. Courbe de la récupération $ f_r(tws)$

L'influence du vent sur la récupération d'énergie ou stamina nous est donnée par la courbe suivante:

:::figure rows image=center width=60%
![5. Courbe de la récupération $ f_r(tws)$](/assets/help/energy/tuto/el_ref_curve_vr.png)
:::

On constate que cette courbe a la même allure que la courbe servant de base au calcul des pénalités.

Néanmoins, la courbe a subi une déformation ainsi qu 'un glissement de repère en abscisse.

ITYC se sert donc de la courbe de référence des pénalités en applicant ces transformations .

