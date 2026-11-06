# Polar calculations

Polars describe a boat’s theoretical speed for a given wind, sail and equipment configuration. ITYC uses the same data and speed calculation for polar charts, the sail usage map and the Auto Sails analysis.

This chapter explains the calculations. The [polar tutorial](#aide?article=tuto_polaire) covers the controls and how to read the charts.

<!-- anchor:calc-polar-inputs -->
## 1. Calculation data and inputs

Each boat’s data contains a grid of wind angles and speeds, a speed table for each sail and the coefficients of its available equipment.

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $\alpha$ or TWA | Boat angle relative to the true wind | Degrees |
| $w$ or TWS | True wind speed | Knots |
| $v_s$ | Boat speed with sail $s$ | Knots |
| $S$ | Set of sails enabled in the selection bar | — |

Only enabled sails are compared when selecting the best sail. Changing this selection can therefore change the maximum speed, optimum angles and boundaries between sails.

Angles are studied over a half-plane, from 0° to 180°: the polar represents both tacks by symmetry.

<!-- anchor:calc-polar-interpolation -->
## 2. Interpolating a sail’s speed

A sail’s table does not contain a value for every TWA/TWS combination. ITYC calculates intermediate values by **bilinear interpolation**, using the four points surrounding the requested conditions.

<!-- anchor:calc-polar-interpolation-weights -->
### 2.1 Position between reference points

If $\alpha_0 \leq \alpha \leq \alpha_1$ and $w_0 \leq w \leq w_1$, define:

$$
x=\frac{\alpha-\alpha_0}{\alpha_1-\alpha_0},\qquad
y=\frac{w-w_0}{w_1-w_0}
$$

The coefficients $x$ and $y$ describe the position within the grid cell, between 0 and 1.

<!-- anchor:calc-polar-interpolation-speed -->
### 2.2 Combining the four speeds

Writing $v_{00}$, $v_{10}$, $v_{01}$ and $v_{11}$ for the speeds at the four corners:

$$
v_{interp}=(1-x)(1-y)v_{00}+x(1-y)v_{10}+(1-x)yv_{01}+xyv_{11}
$$

At the midpoint of both intervals, the four values have equal weight. At a grid point, the result is exactly the value in the table.

Outside the table’s limits, the calculation keeps the value at the nearest boundary on the relevant axis: it does not extrapolate speed beyond the available data.

<!-- anchor:calc-polar-options -->
## 3. Speed coefficients and equipment

The interpolated speed is multiplied by the boat’s coefficients and those of its enabled options:

$$
v_s=v_{interp}\times C_{global}\times C_{coque}\times C_{foils}
$$

<!-- anchor:calc-polar-hull -->
### 3.1 Global coefficient and hull polish

$C_{global}$ is the general coefficient supplied by the polar, or 1 if none is defined. Hull polish uses the boat’s hull coefficient when enabled; otherwise, $C_{coque}=1$.

**Full pack** enables the corresponding options and sails. It does not add another speed coefficient on top of those already applied.

<!-- anchor:calc-polar-foils -->
### 3.2 Progressive foil activation

The effect of foils depends on both TWA and TWS. For each axis, the polar specifies a range of maximum efficiency and a transition width on either side.

For a value $z$, a range $[a,b]$ and a transition width $m$, intensity $A$ is:

$$
A(z)=\begin{cases}
0 & z\leq a-m\ \text{or}\ z\geq b+m \\
\dfrac{z-a+m}{m} & a-m<z<a \\
1 & a\leq z\leq b \\
\dfrac{b+m-z}{m} & b<z<b+m
\end{cases}
$$

The contributions from wind angle and speed are multiplied:

$$
C_{foils}=1+(R_{foils}-1)\times A_{TWA}(\alpha)\times A_{TWS}(w)
$$

$R_{foils}$ is the maximum coefficient supplied by the boat’s polar. If both intensities equal 1, the foil benefit is at its maximum. If either equals 0, there is no benefit. Intensities of 50% on both axes give 25% of the maximum benefit.

When foils are disabled or absent from the boat’s data, $C_{foils}=1$.

<!-- anchor:calc-polar-optimum -->
## 4. Best sail, VMG and maximum speed

<!-- anchor:calc-polar-best-sail -->
### 4.1 Theoretical best sail

At each TWA/TWS combination, ITYC calculates every sail’s speed and keeps the fastest enabled sail:

$$
v_{max}(\alpha,w)=\max_{s\in S}v_s(\alpha,w)
$$

A point or segment’s colour identifies this sail. This is an instantaneous selection: it deducts neither sail-change time nor energy loss.

The margin for retaining a sail in automatic mode is covered separately in [Auto Sails calculations](#aide?article=aide_autoSail).

<!-- anchor:calc-polar-vmg -->
### 4.2 VMG and optimum wind angle

VMG is the projection of boat speed onto the wind axis:

$$
VMG(\alpha,w)=v_{max}(\alpha,w)\times\cos\left(\frac{\pi\alpha}{180}\right)
$$

It is positive upwind and negative downwind. For each TWS, the calculation finds the angle that maximises upwind VMG and the angle that makes downwind VMG most negative. The charts display absolute VMG values.

**BVMG** gives the corresponding angles. The **VMG** chart gives the useful speeds at those angles. Actual boat speed can exceed VMG: only its component along the wind axis contributes to VMG.

<!-- anchor:calc-polar-best-speed -->
### 4.3 BSPD and VSPD

The maximum-speed search compares speeds over all sampled angles for a given TWS:

$$
VSPD(w)=\max_{\alpha}v_{max}(\alpha,w)
$$

**BSPD** is the TWA at which this maximum speed is reached; its unit is degrees. **VSPD** is the corresponding speed, in knots.

Maximum-speed angle and best-VMG angle serve different objectives and do not necessarily coincide.

<!-- anchor:calc-polar-curves -->
## 5. Building the charts and sail usage map

Speed charts are recalculated point by point using the selected boat, options and sails.

| Chart | Calculation |
| --- | --- |
| Speed by TWA | Vary TWA at a fixed TWS, with reference curves at TWS − 1 and TWS + 1 knot |
| Speed by TWS | Vary TWS at a fixed TWA, with reference curves at TWA − 2° and TWA + 2° |
| BVMG and VMG | Find the best upwind and downwind VMG for each TWS |
| BSPD and VSPD | Find the maximum speed and its TWA for each TWS |
| Sail usage | Identify the fastest sail at every point of the TWA/TWS grid |

Neighbouring references are limited to 0° and 180° for TWA and to a minimum of 0.1 knot for TWS − 1. If a reference exceeds the polar table, interpolation remains bounded by the data.

The sail usage map represents the theoretical best sail, without the automatic sail-retention margin. A colour boundary marks a change in the winning sail, rather than necessarily a discontinuity in speed.

<!-- anchor:calc-polar-precision -->
## 6. Resolution and interpretation limits

Results are calculated on sampling grids. Values displayed with several decimal places do not mean that the optimum search has the same fine resolution.

| Calculation | Step and search range |
| --- | --- |
| Speed by TWA | 0.1° steps, starting at 0° |
| Speed by TWS | 0.1- or 0.01-knot steps, starting at 0.1 knot |
| BVMG, VMG, BSPD and VSPD charts | TWS from 1 knot in 0.1- or 0.01-knot steps; TWA search from 1° in 0.1° steps |
| Sail usage map | 0.1- or 0.01-knot steps from 0.5 knot and 1° steps from 0° |

The button before reset zoom shows the active TWS step. Clicking switches between 0.1 and 0.01 independently for each chart. The Expert diagram's TWS control uses a fixed 0.01-knot step.

Upper limits follow the boat’s data, capped at 50 knots and 180°. The Expert visual analyser uses the same speed calculation but starts its angular search at 0°, in 0.1° steps: a small difference from a derived chart may therefore result from sampling.

These speeds describe theoretical performance in fixed conditions. They include neither manoeuvre penalties, future wind changes nor a route. To decide on a sail change, complement this comparison with [penalty calculations](#aide?article=aide_pena) and [energy calculations](#aide?article=aide_energy).

[Open the polar tool](polar.html) · [Read the tutorial](#aide?article=tuto_polaire) · [Glossary](#aide?article=glossaire)
