# Calculating energy loss and recovery times

<!-- anchor:tp_p1 -->
## 1. Energy loss

As in real sailing, manoeuvres and sail changes in Virtual Regatta consume different amounts of energy depending on wind strength and boat type.

[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including energy or stamina consumption for each type of manoeuvre.

:::table width=60% align=center
| Manoeuvre | Loss rate |
| --- | --- |
| Tack | 10% |
| Gybe | 10% |
| Sail change | 20% |
:::

In general, energy loss $P_e$ is equal to:

- the basic manoeuvre loss rate $P_{e_{Base}}$ when True Wind Speed (TWS) is 0 kts;

- the result of the following calculation:

  $$
  P_e(tws) ={ P_{e_{Base}} \times f_p(tws) \times C_{bateau}}
  $$

   Where:

  - $P_{e_{Base}}$: default manoeuvre loss rate

  - $f_p(tws)$: contribution of the energy-loss reference curve, normalised from 1 to 2

  - $C_{bateau}$: boat multiplier, from 1 to 2

<!-- anchor:tp_p2 -->
## 2. Energy loss curve $ f_p(tws)$

The effect of wind on energy or stamina loss is given by the following curve:

:::figure rows image=center width=60%
![2. Energy loss curve $ f_p(tws)$](/assets/help/energy/tuto/el_ref_curve_vr.png)
:::

This curve can be divided into four sections.

- From 0 to 10 kts

  $$
  f_p(tws) = {0.02 \times tws + 1}
  $$

- From 10 to 20 kts

  $$
  f_p(tws) = {0.03 \times tws + 0.9}
  $$

- From 20 to 30 kts

  $$
  f_p(tws) = {0.05 \times tws + 0.5}
  $$

- Above 30 kts

  $$
  f_p(tws) = {2}
  $$

<!-- anchor:tp_p3 -->
## 3. Boat multiplier $C_{bateau}$

As on a real boat, boat type affects the time needed to perform a manoeuvre.

Virtual Regatta has not officially published the multiplier for each boat.

However, thanks to the community's work, we know that there are four different multipliers:

$\times 1$ , $\times 1,2$ , $\times 1,5$ , $\times 2$

Based on testing, the table below appears to reflect the consensus, but its values cannot be guaranteed.
:::table width=60%  align=center
| Boat | Multiplier |
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
## 4. Energy recovery

As in real sailing, the calmer the conditions, the faster your skipper recovers energy.

[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including energy or stamina recovery.

The effect of wind strength is given by the following curve:

:::figure rows image=center width=60%
![4. Energy recovery](/assets/help/energy/tuto/er_ref_curve_vr.png)
:::
In general, the time $T_r$ needed to recover one percentage point of energy is equal to:

- $T_r{min}$ = 5 minutes per point when True Wind Speed (TWS) is 10 kts;

- $T_r{max}$ = 15 minutes when True Wind Speed (TWS) is above 30 kts;

- the result of the following calculation:

  $$
  T_r(tws) ={ { { (T_r{max} - T_r{min}) \times f_r(tws)}\over 100}}
  $$

   Where:

  - $T_r(tws)$: recovery time

  - $T_r{min}$: minimum recovery time

  - $T_r{max}$: maximum recovery time

  - $f_r(tws)$: contribution of the reference curve, normalised from 0 to 100%


<!-- anchor:tp_p5 -->
## 5. Recovery curve $ f_r(tws)$

The effect of wind on energy or stamina recovery is given by the following curve:

:::figure rows image=center width=60%
![5. Recovery curve $ f_r(tws)$](/assets/help/energy/tuto/el_ref_curve_vr.png)
:::

This curve has the same overall shape as the reference curve used to calculate penalties.

However, it has been reshaped and shifted along the horizontal axis.

ITYC therefore applies these transformations to the penalty reference curve.

