# Polars tutorial
<!-- anchor:tp_p1 -->
## 1. Page overview
Boat polars show boat speed as a function of several parameters:

- The boat's options (foils / hull polish).

- The available sails.

- Wind speed (TWS).

- Wind angle (TWA).

This can make them difficult to understand, and learning all their subtleties can take time.

Polars can sometimes have "gaps": conditions in which the boat loses speed or gains none. These can be difficult to spot in a "traditional" polar diagram.

ITYC.fr provides this calculator to help you analyse boat polars more easily.

The data appears once you select a boat.

:::figure rows image=center width=100% blocks=68%,20%,12%
![Penalties overview](/assets/help/polar/entete/polar_entete.png)


Boat selection.

---

Polar update date.

---

Display mode.

:::
:::figure rows image=center width=100% blocks=36%,52%,12% 


Packs / Options

---

Sails.

---

Polar mode.

:::

ITYC.FR provides two page layouts:
- Focus mode: one chart per page for better visibility.
- Grid mode: two charts per page for a more compact layout.

<!-- anchor:tp_p1_1 -->
### 1.1 Focus mode
:::figure side image=left width=75% blocks=14%,15%,14%,14%,14%,14%,15%
![Polar overview in Focus mode](/assets/help/polar/polar_viewall.png)

Polar analyser (Expert mode).

---

Boat speed as a function of wind speed (TWS) at a fixed wind angle (TWA).

---

Boat speed as a function of wind angle (TWA) at a fixed wind speed (TWS).

---

Boat speed as a function of wind speed (TWS) at the best VMG.

---

Best Speed as a function of wind speed (TWS).

---

VMG as a function of wind speed (TWS).

---
Sail usage map (TWS, TWA).

:::

<!-- anchor:tp_p1_1_2 -->
### 1.2 Normal Grid mode

:::figure side image=left width=65% 
![Polar overview in Grid mode](/assets/help/polar/polar_viewall_g.png)


Boat speed as a function of wind speed (TWS) at a fixed wind angle (TWA).

Boat speed as a function of wind angle (TWA) at a fixed wind speed (TWS).

---

Boat speed as a function of wind speed (TWS) at the best VMG.

Best Speed as a function of wind speed (TWS).

---

VMG as a function of wind speed (TWS).

Sail usage map (TWS, TWA).

:::

<!-- anchor:tp_p1_1_2 -->
### 1.2 Expert Grid mode


:::figure side image=left width=65% blocks=10%,20%,20%,25%,25%
![Polar overview in Grid mode](/assets/help/polar/polar_viewall_g_e.png)

Polar analyser (Expert mode).

---

Boat speed as a function of wind speed (TWS) at a fixed wind angle (TWA).

---

Boat speed as a function of wind angle (TWA) at a fixed wind speed (TWS).

---

Boat speed as a function of wind speed (TWS) at the best VMG.

Best Speed as a function of wind speed (TWS).

---

VMG as a function of wind speed (TWS).

Sail usage map (TWS, TWA).

:::

## 2. Normal / Expert mode

:::figure side width=20%
![Polar Normal / Expert mode](/assets/help/polar/entete/polar_enteteMode.png)

* Normal mode provides ITYC's traditional display.

* In Expert mode, the polar analyser appears on the page. (See the dedicated chapter.)

:::

<!-- anchor:tp_p2 -->
## 3. Boat selection

:::figure side 
![Boat selection in ITYC](/assets/help/common/select_boat_ityc.png)
Select the boat using the selector at the top of the page.
:::

:::figure side 
![Boat selection in the game](/assets/help/common/select_boat_game.png)
You can find the boat type in the game at the top left of the polars page.
:::

:::figure side
![Boat selection in Toxcct](/assets/help/common/select_boat_toxcct.png)

On the excellent [Toxcct by INC](http://inc.bureauvallee.free.fr/polaires/) or [Toxcct by LSV](https://vro.civis.net/polars) websites, look in the left-hand column.
:::

:::figure side width=50%
![Boat selection in the dashboard](/assets/help/common/select_boat_dash.png)

In our dashboard, open the Summary tab and look under Race details, Boat Name.
:::

<!-- anchor:tp_p3 -->
## 4. Option selection
:::figure rows image=center width=100% blocks=41%,59%
![Overview](/assets/help/polar/entete/polar_enteteOptions.png)


The area for managing options and packs.

---

The area for enabling or disabling each sail.

:::

### 4.1 Options and Packs

:::figure rows image=center width=70% 
![Options and Packs](/assets/help/polar/entete/polar_entetePack.png)


- **Full pack**: enables all options and sails in one click!

---

- **Foils**: enables or disables the foils.

---

- **Hull polish**: enables or disables the polish option.

:::
:::figure rows image=center width=70% blocks=41%,59%


- **Heavy-weather sails**: enables or disables the heavy-weather sail pack (HG / SS).

---

- **Reaching sail**: enables or disables the reaching sail pack (C0).

---

- **Light-weather sails**: enables or disables the light-weather sail pack (LG / LJ).

:::

### 4.2 Sails

:::figure rows image=center width=70%
![Sails](/assets/help/polar/entete/polar_enteteVoile.png)

In this section, you can enable or disable each sail independently.

For ease of use, the abbreviation of each sail's English name is shown in parentheses.
:::

## 5. Polar analyser

### 5.1 Overview

The analyser displays the full TWA range as a butterfly diagram for a given TWS.

You can view foil usage, each sail's envelope, the active sail's limits (with or without automatic sails), the best VMG values and Best Speed.

In Focus mode:
:::figure rows image=center width=80% blocks=50%,25%,25%
![Expert polar in Focus mode](/assets/help/polar/curve/polar_expert_All.png)


Polar diagram.

---

Chart settings and polar information.

---

Additional polar information.

:::

In Grid mode:
:::figure rows image=center width=80% blocks=65%,35%
![Expert polar in Focus mode](/assets/help/polar/curve/polar_expert_All_g.png)


Polar diagram.

---

Chart settings and polar information.

:::
### 5.2 Settings
:::figure side image=left  blocks=25%,35,40%
![Energy loss calculator](/assets/help/polar/curve/polar_expert_setting.png)


Display selector.

---

Mean wind angle TWA (°).

*Note: you can also select the TWA by clicking the diagram.*

---

Set the wind speed (kts).

:::

#### 5.2.1 Display selector 
:::figure side image=left  width=32%
![Energy loss calculator](/assets/help/polar/curve/polar_expert_setting_diag.png)


**All** shows the sail envelopes.

**Foils** shows the foil usage arc and the information beside the TWA cursor.

**Auto Sails** shows the active sail's limits, taking the overspeed coefficient into account.

:::

### 5.3 Polar information
:::figure side image=left  width=32% blocks=40%,35%,25%
![Energy loss calculator](/assets/help/polar/curve/polar_expert_infos1.png)


For the selected TWA and TWS, read:
* TWA (°).
* Boat speed (kts).
* VMG (kts).
* Best sail.

---

For the selected TWS, read the Best Speed information:
* TWA (°).
* Boat speed (kts).
* Sail.

---

For the selected TWS, read the Best VMG information:
* Upwind: TWA (°) and boat speed (kts).
* Downwind: TWA (°) and boat speed (kts). 

:::
:::figure side image=left  width=32% blocks=32%,68%
![Energy loss calculator](/assets/help/polar/curve/polar_expert_infos2.png)


For the active sail, read the TWS and TWA ranges.

---

For the selected TWS, read the following for each sail:
* Boat speed (kts).
* VMG (kts).

*Note1: the active sail is displayed in bold.*

*Note2: when sails overlap, the overlapped sail's speed is shown in parentheses if the Auto Sails feature is enabled.*

:::

### 5.4 Chart features

:::figure side image=left  width=32% 
![Energy loss calculator](/assets/help/polar/curve/polar_expert_Curve.png)

1
* The TWA cursor uses the sail's colour.
* At its end, read the current TWA, boat speed, active sail and foil activation percentage.
* Move it by clicking the chart, holding the mouse button and dragging, or using the slider.

---
2
 * Two markers are displayed in the active sail's colour.

---
3
* The blue area represents the foil activation zone.


---

4
* The red areas represent the zones outside the VMG range.
* The red dashed lines indicate Best VMG upwind and downwind.


:::
* Click a curve's name to show or hide it.
* Use the mouse wheel to zoom the chart.
* After zooming, hold the left mouse button to pan the chart.
* Use the 'reset zoom' button to reset the view.


## 6. Boat speed - f(tws) at fixed TWA
### 6.1 Overview
After selecting your equipment, set the wind angle (TWA) using the controls to the right of the chart.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_twa_curve.png)
:::

### 6.2 Settings
:::figure side image=left  width=30%
![Energy loss calculator](/assets/help/polar/curve/polar_tws_curve_set.png)

Set the wind speed (kts).

:::

### 6.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_twa_curve.png)

Three curves are displayed by default: the selected TWS, TWS + 1 and TWS - 1.

---

The curve colour indicates the best sail at the specified wind speed, TWS.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/polar/curve/polar_twa_tooltip.png)

Wind angle (°).

---

At the selected TWS: boat speed (kts) and active sail.

---

At TWS - 1 and TWS + 1: boat speed (kts), the speed difference from the TWS curve and the active sail.

:::


## 7. Boat speed - f(twa) at fixed TWS
### 7.1 Overview
After selecting your equipment, set the wind speed (TWS) using the controls to the right of the chart.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_tws_curve.png)
:::

### 7.2 Settings
:::figure side image=left  width=30%
![Energy loss calculator](/assets/help/polar/curve/polar_tws_curve_set.png)

Set the wind angle (°).

:::

### 7.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_tws_curve.png)

Three curves are displayed by default: the selected TWA, TWA + 2 and TWA - 2.

---

The curve colour indicates the best sail at the specified wind angle, TWA.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/polar/curve/polar_tws_tooltip.png)

Wind speed (kts).

---

At the selected TWA: boat speed (kts) and active sail.

---

At TWA - 2 and TWA + 2: boat speed (kts), the speed difference from the TWA curve and the active sail.

:::

## 8. BestVMG wind angle - f(tws) TWA for best VMG 
### 8.1 Overview


After selecting your equipment, the best VMG chart appears.

It shows the wind angle (TWA) that achieves the best VMG as a function of wind speed.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_bspd_curve.png)
:::

### 8.2 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_bspd_curve.png)

The TWA curves show the best upwind wind angle (Best VMG UP) and the best downwind wind angle (Best VMG DW) as a function of TWS.

---

The curve colour indicates the best sail at the specified TWS / TWA.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/polar/curve/polar_bvmg_curve_tooltip.png)

Wind speed (kts).

---

At the selected TWS: the Best VMG DW TWA, boat speed (kts) and active sail.

---

At the selected TWS: the Best VMG UP TWA, boat speed (kts) and active sail.

:::


## 9. Boat speed - f(tws) VMG 
### 9.1 Overview

After selecting your equipment, the TWA chart for speed appears.

It shows upwind and downwind VMG as a function of wind speed.

VMG is the useful component of speed along the wind axis: it describes progress, not just speed through the water.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_vmg_curve.png)
:::

### 9.2 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_vmg_curve.png)

The curves show upwind VMG (VMG UP) and downwind VMG (VMG DW) as a function of TWS.

---

The curve colour indicates the best sail at the specified TWS / TWA.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/polar/curve/polar_vmg_curve_tooltip.png)

Wind speed (kts).

---

At the selected TWS: VMG DW, wind angle (TWA °), boat speed (kts) and active sail.

---

At the selected TWS: VMG UP, wind angle (TWA °), boat speed (kts) and active sail.

:::

## 10. BestSpeed wind angle - f(tws) TWA for Best Speed f(tws)
### 10.1 Overview

After selecting your equipment, the TWA chart for speed appears.

It shows the TWA that achieves the best upwind and downwind speed as a function of wind speed.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_bspd_curve.png)
:::

### 10.2 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_bspd_curve.png)

The TWA curve shows the angle that achieves the best boat speed (Best Speed) as a function of TWS.

---

The curve colour indicates the best sail at the specified TWS / TWA.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/polar/curve/polar_bspd_curve_tooltip.png)

Wind speed (kts).

---

At the selected TWS: the TWA for Best Speed, boat speed (kts) and active sail.

:::


## 11. BestSpeed boat speed - f(tws) Maximum boat speed
### 11.1 Overview

After selecting your equipment, the maximum boat speed chart appears.

It shows the highest boat speed (VSPD) achievable at each wind speed (TWS), using the selected sails and equipment.

:::figure rows image=center width=80%
![Maximum boat speed in Focus mode](/assets/help/polar/curve/polar_spd_curve.png)
:::

### 11.2 Chart features
:::figure side width=60%
![Maximum boat speed chart](/assets/help/polar/curve/polar_spd_curve.png)

The curve shows Best Speed as a function of TWS.

---

The curve colour indicates the best sail at the specified TWS / TWA.

---

Click a curve's name to show or hide it.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Maximum boat speed tooltip](/assets/help/polar/curve/polar_spd_curve_tooltip.png)

Wind speed (kts).

---

At the selected TWS: boat speed (kts), wind angle (TWA ?) and active sail.

:::

## 12. Sail usage map
### 12.1 Overview

After selecting your equipment, the TWA chart for speed appears.

The map plots wind conditions on two axes: TWS horizontally and TWA vertically. Each coloured zone indicates the fastest sail among those selected for these conditions. The colours match the charts.
* Reading the map
The map plots wind conditions on two axes: TWS horizontally and TWA vertically. Each coloured zone indicates the fastest sail among those selected for these conditions. The colours match the charts.

* Speed contours
The lines and their labels indicate boat speed levels. They help identify zones where speed changes quickly or remains similar despite changing wind conditions.

:::figure rows image=center width=80%
![Energy loss in Focus mode](/assets/help/polar/curve/polar_bsail_curve.png)
:::

### 12.2 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/polar/curve/polar_bsail_curve.png)

The sail usage map as a function of TWA and TWS.

---

The curve colour indicates the best sail at the specified TWS / TWA.

---

After zooming, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom the chart.

---

Use the 'reset zoom' button to reset the view.

:::

Hover over the curve to display a tooltip like this:

:::figure side width=30%
![Energy loss tooltip](/assets/help/polar/curve/polar_bsail_curve_tooltip.png)

TWS Wind speed (kts).

---

TWA Wind angle (°).

---

Sail and boat speed.

:::

