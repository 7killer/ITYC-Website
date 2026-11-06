# Auto Sails calculations

A sail can remain useful in automatic mode even when another is slightly faster. ITYC calculates this retention margin, a sail’s usage ranges and the overlap zones between two sails using the boat’s polars.

This chapter explains the calculations. The [Auto Sails tutorial](#aide?article=tuto_autoSail) covers the settings and charts.

<!-- anchor:calc-autosail-speeds -->
## 1. Speeds used in the comparison

For each combination of true wind angle (TWA) and true wind speed (TWS), ITYC calculates every sail’s speed using bilinear interpolation and the boat’s hull, foil and speed coefficients. These steps are described in [polar calculations](#aide?article=aide_polaire).

The reference is the best speed among enabled sails:

$$
v_{max}=\max_{s\in S}v_s
$$

Here $v_s$ is the speed of sail $s$, and $S$ is the set of enabled sails. The boat, available sails and options must match the configuration being studied.

The sail analysed in each chart is chosen in its selector. The other enabled sails establish the best competing speed.

<!-- anchor:calc-autosail-tolerance -->
## 2. Sail-change tolerance

<!-- anchor:calc-autosail-coefficient -->
### 2.1 Retention coefficient

The boat’s polar may provide a tolerance coefficient $k$. If it does not, ITYC uses:

$$
k=1.014
$$

This coefficient represents a margin of 1.4% of the analysed sail’s speed. It is used only to compare sails: it does not increase their actual speed.

A sail with speed $v_s$ is considered **active**, meaning that it can be retained within the calculated automatic usage range, when:

$$
v_s>0\qquad\text{and}\qquad k\times v_s>v_{max}
$$

The test is strict. At equality, $k\times v_s=v_{max}$, the sail is no longer within the calculated active range.

<!-- anchor:calc-autosail-example -->
### 2.2 Numerical example

With an analysed sail doing 10 knots and $k=1.014$, the comparison threshold is 10.14 knots.

| Best competing speed | Calculation result |
| --- | --- |
| 10.13 knots | The 10-knot sail remains active: the margin allows it to be retained |
| 10.14 knots | The 10-knot sail is no longer active: the threshold has been reached |
| 10.15 knots | The 10-knot sail is no longer active: the best sail exceeds the threshold |

This margin creates conditions in which several sails can remain active. The sail actually in use then depends on the previous situation; TWA and TWS alone are not enough to identify a unique sail.

<!-- anchor:calc-autosail-curves -->
## 3. Fixed-TWA and fixed-TWS charts

The first two charts vary one condition while keeping the other constant:

| Chart | Fixed input | Horizontal axis |
| --- | --- | --- |
| Active sail · fixed TWA | Wind angle | Wind speed, in knots |
| Active sail · fixed TWS | Wind speed | Wind angle, in degrees |

The calculation advances in 0.1- or 0.01-knot steps on the TWS axis, as selected by the chart's precision button. The TWA axis keeps 0.1° steps. At each point in the chosen interval, it determines $v_s$, $v_{max}$, the best sail and whether the retention threshold is satisfied.

<!-- anchor:calc-autosail-series -->
### 3.1 Meaning of Auto, Theoretical and Manual

| Curve | Value represented |
| --- | --- |
| Theoretical | Best speed $v_{max}$, coloured by the theoretical best sail |
| Manual | Speed $v_s$ of the analysed sail, retained throughout all conditions |
| Auto | The same vertical value $v_{max}$ as Theoretical; colours and dashes show where the analysed sail may be retained despite a faster sail |

In an overlap zone, **Auto** uses a dashed line in the analysed sail’s colour. The speed difference shown in the tooltip is:

$$
\Delta v=v_{max}-v_s
$$

The Auto curve’s vertical value is a theoretical performance reference. To find the speed of the retained sail in that zone, read **Manual**; the tolerance coefficient does not turn its speed into $v_{max}$.

<!-- anchor:calc-autosail-intervals -->
### 3.2 Displayed usage ranges

Intervals group consecutive points satisfying the retention test. Several separate ranges can appear if a sail stops being active and then becomes active again.

The boundaries correspond to sampled points: they do not come from an exact analytical solution of the threshold.

<!-- anchor:calc-autosail-usage -->
## 4. A sail’s usage zone

The usage zone applies the same test over a full TWA/TWS grid.

For each wind speed $w$, the calculation keeps the angles at which the analysed sail remains active:

$$
U_s(w)=\{\alpha\mid v_s(\alpha,w)>0\ \text{and}\ k\,v_s(\alpha,w)>v_{max}(\alpha,w)\}
$$

When this set contains points, the two displayed curves are:

$$
TWA_{mini}(w)=\min U_s(w),\qquad TWA_{maxi}(w)=\max U_s(w)
$$

The calculation samples TWS from 0.1 knot in **0.1- or 0.01-knot** steps, selected with the precision button, and TWA in **0.1°** steps, within the polar’s bounds limited to 0°–180° and 50 knots.

“No usage zone” means that no valid grid point satisfies the test for the selected configuration.

<!-- anchor:calc-autosail-overlap -->
## 5. Overlap zone between two sails

An overlap zone contains conditions in which both analysed sails simultaneously satisfy the retention threshold:

$$
U_{s_1,s_2}(w)=U_{s_1}(w)\cap U_{s_2}(w)
$$

Both comparisons use the same best speed $v_{max}$, calculated among **all enabled sails**. A third sail can therefore reduce or remove the overlap between the pair being studied.

As for a single sail, the curves show the lowest and highest retained angles for each TWS. It is not enough for two sails to have similar speeds: each must remain sufficiently close to the best available sail.

<!-- anchor:calc-autosail-precision -->
### 5.1 Precision setting

| Selected precision | TWS step | TWA step |
| --- | --- | --- |
| 0.1 | 0.1 knot | 0.1° |
| 0.01 | 0.01 knot | 0.01° |

Fine precision can reveal a narrow band missed by the coarser grid. It requires more calculation, but changes neither the polar, the tolerance coefficient nor the comparison test.

<!-- anchor:calc-autosail-limits -->
## 6. Scope and limits of the results

The zones represent fixed conditions, without simulating a sequence of wind or sail changes. They show where a sail **may be retained**, rather than which sail the boat will necessarily be carrying after following a particular course.

Zone charts keep only the minimum and maximum TWA for each TWS. If active points form several separate ranges at the same TWS, gaps between them are not detailed within the coloured envelope. Fixed-TWS curves allow closer examination of such cases.

Boundaries depend on the sampling step and available data. Displaying several decimal places does not make a boundary more precise than the grid used.

Finally, the calculation deducts no sail-change slowdown and does not calculate the change’s break-even point. To compare the expected gain with the manoeuvre’s cost, use [penalty calculations](#aide?article=aide_pena) and the [break-even tutorial](#aide?article=tuto_pena&section=tp_p5).

[Open Auto Sails](autoSail.html) · [Read the tutorial](#aide?article=tuto_autoSail) · [Glossary](#aide?article=glossaire)
