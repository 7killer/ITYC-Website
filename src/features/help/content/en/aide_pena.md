# Calculating penalty times

<!-- anchor:tp_p1 -->
## 1. Penalty curve

As in real sailing, manoeuvre and sail-change times in Virtual Regatta vary with wind strength and boat type.

[This page](https://virtualregatta.zendesk.com/hc/fr/articles/115001441474) lists the manoeuvre times for each boat and provides the following curve:

:::figure below width=80%
![1. Penalty curve](/assets/help/penalties/tuto/pena_ref_curve_vr.png)
:::

In general, manoeuvre time $T_m$ is equal to:

- the minimum manoeuvre time $T_{min}$ when True Wind Speed (TWS) is below 10 kts;

- the maximum manoeuvre time $T_{max}$ when True Wind Speed (TWS) is above 30 kts;

- the result of the following calculation:

  $$
  T_m(tws) ={( {{(T_{max} - T_{min}) \times f(tws)}\over 100} + T_{min})\times C_{stamina}\times C_{MagicFurler}}
  $$

   Where:

  - $T_m(tws)$: manoeuvre time

  - $T_{min}$: minimum manoeuvre time

  - $T_{max}$: maximum manoeuvre time

  - $f(tws)$: contribution of the reference curve, normalised from 0 to 100%

  - $C_{stamina}$: stamina multiplier, from 0.5 to 2

  - $C_{MagicFurler}$: Magic Furler option multiplier, from 0.8 to 1

The result cannot be lower than $T_{min}$.

<!-- anchor:tp_p2 -->
## 2. Reference curve $ f(tws)$

Measurements taken in the game, with support from the community, made it possible to model the curve supplied by VR using the following equation.

$$
f(tws) = {50 - {cos({{{tws - 10} \over {30 - 10}}\times\pi})} \times 50}
$$

 Where:

- $f(tws)$: contribution of the reference curve, normalised from 0 to 100%

- $tws$: True Wind Speed in kts

<!-- anchor:tp_p3 -->
## 3. Stamina multiplier $ C_{stamina}$

As on a real boat, the skipper's fitness affects the time needed to perform a manoeuvre.

Virtual Regatta introduced the skipper's energy, or stamina, to account for this effect.

[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including the effect of fitness on manoeuvre time shown by this curve:

:::figure below
![3. Stamina multiplier $ C_{stamina}$](/assets/help/penalties/tuto/pena_ref_curve_stamina_vr.png)
:::

The stamina multiplier can therefore be calculated from the skipper's fitness $Energie_{skipper}$ using the following equation:

$$
C_{stamina} ={ Energie_{skipper} \times -0,015 + 2 }
$$

If the skipper's energy exceeds 100%, it is capped at 100% for this calculation.


<!-- anchor:tp_p4 -->
## 4. Furler / Magic Furler option $C_{MagicFurler}$
For a sail change, if your boat has the Magic Furler option, a manoeuvre-time reduction factor must be applied.
$$
C_{MagicFurler} ={ 0,8 }
$$
Otherwise, the factor is set to 1.0.
$$
C_{MagicFurler} ={ 1,0 }
$$

Using these equations and the manoeuvre reference values contained in the game's polars, **ITYC.fr** calculates the penalty for every boat type at each 0.1-knot wind increment.
