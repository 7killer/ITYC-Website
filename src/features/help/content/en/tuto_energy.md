# Energy tutorial

<!-- anchor:tp_p1 -->
## 1. Page overview
### 1.1 Overview

In Virtual Regatta, as in real sailing, your skipper can be fit or tired.

The energy, or stamina, gauge ranges from 0 to 100%. Penalty duration is multiplied by a factor from 0.5 to 2. (See [here](https://ityc.fr/aide_pena.html) for details.)

ITYC.fr provides this calculator to work out energy loss and recovery rates for your boat and the current conditions.

The data is displayed after you select a boat.

:::figure rows image=center width=100% blocks=23%,40%,22%,15%
![Energy page overview](/assets/help/energy/energy_vueensembleEntete.png)


Boat selection.

---

Equipment selection.

---

Polar update date.

---

Display mode.

:::

ITYC.FR offers two page layouts:
- Focus mode: one chart per view for better visibility.
- Grid mode: two charts per view for a more compact layout.

### 1.2 Chart controls

#### 1.2.1 Display mode
You can switch display modes in two ways:

* Using the selector at the top of the page ![Description](/assets/help/common/focusgrille.png "icon:2.5em")
* Using the buttons on each chart
  * Switch from Focus to Grid mode ![Description](/assets/help/common/modeGrilleCurve.png "icon:2.5em")
  * Switch from Grid to Focus mode ![Description](/assets/help/common/modeFocusCurve.png "icon:2.5em")


*When switching modes, the page scrolls automatically to keep the current chart in view.*

#### 1.2.2 Reset zoom

You can reset a chart's zoom at any time by pressing the button ![Description](/assets/help/common/resetZoom.png "icon:2.5em")

#### 1.2.3 Help shortcut

You can open the help for the current chart at any time by clicking this button ![Description](/assets/help/common/aide.png "icon:2.5em")

#### 1.2.4 Precision

For every chart with TWS on the X axis, you can choose a calculation step of 0.1 or 0.01.
* Click this button ![Description](/assets/help/common/precision10.png "icon:2.5em") to switch the calculation to 0.01 precision.
* Click this button ![Description](/assets/help/common/precision100.png "icon:2.5em") to switch the calculation to 0.1 precision.

*A precision of 0.01 requires more calculation time.*

<!-- anchor:tp_p1_1 -->
### 1.3 Focus mode
:::figure side image=left width=75% 
![Energy page overview in focus mode](/assets/help/energy/energie_vueensemble.png)

Energy lost during a manoeuvre.

---

Energy recovery.

:::

<!-- anchor:tp_p1_1_2 -->
### 1.4 Grid mode

:::figure side image=left width=75% 
![Energy page overview in grid mode](/assets/help/energy/energy_vueensemble_g.png)

Energy lost during a manoeuvre / Energy recovery.


:::

<!-- anchor:tp_p2 -->
## 2. Boat selection

:::figure side 
![Boat selection on ITYC](/assets/help/common/select_boat_ityc.png)
Select your boat using the selector at the top of the page.
:::

:::figure side 
![Boat selection in the game](/assets/help/common/select_boat_game.png)
In the game, the boat type appears at the top left of the polars page.
:::

:::figure side
![Boat selection on Toxcct](/assets/help/common/select_boat_toxcct.png)

On the excellent [Toxcct by INC](http://inc.bureauvallee.free.fr/polaires/) or [Toxcct by LSV](https://vro.civis.net/polars) websites, look in the left column.
:::

:::figure side width=50%
![Boat selection in the dashboard](/assets/help/common/select_boat_dash.png)

In our dashboard, open the Summary tab and look under Race details, Boat Name.
:::

<!-- anchor:tp_p3 -->
## 3. Equipment selection
Select the equipment fitted to your boat.

:::figure below width=40%  
![Equipment selection](/assets/help/energy/energie_options.png)

Enable Winch if your boat has Winch Pro.

Enable Furler if your boat has Magic Furler.

Enable Jacket if your boat has the VRtex Jacket.

Enable Cushion if your boat has the Confort Lounge.

:::

<!-- anchor:tp_p4 -->
## 4. Energy loss

<!-- anchor:tp_p4_1 -->
### 4.1 Overview

How much energy will you lose when performing a manoeuvre or changing sail?

How long will it take to recover that energy?

This section has two parts:

 - Focus mode
:::figure rows image=center width=80% blocks=77%,23%
![Energy loss in focus mode](/assets/help/energy/el/el_all.png)


Energy loss for each manoeuvre type.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy loss in grid mode](/assets/help/energy/el/el_all_g.png)


Chart settings and calculator.

---

Energy loss for each manoeuvre type.

:::

<!-- anchor:tp_p4_2 -->
### 4.2 Settings and calculator

:::figure side image=left  blocks=30%,70%
![Energy loss calculator](/assets/help/energy/el/el_cal.png)

Set True Wind Speed (kts).

---

Read the energy lost for each manoeuvre type (%)
and the time needed to recover the lost energy.

*Note: These values are identical to those shown on the chart.*

:::

### 4.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/energy/el/el_curve.png)

Green: energy lost during a tack or gybe.

Red: energy lost during a sail change.

---

Show or hide a curve by clicking its manoeuvre name.

---

After zooming in, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom in and out of the chart.

---

Use the 'reset zoom' button to restore the initial view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy loss tooltip](/assets/help/energy/el/el_tooltip.png)

True Wind Speed (knots).

---

Energy loss.
:::

<!-- anchor:tp_p4_3 -->

## 5. Energy recovery

<!-- anchor:tp_p5_1 -->
### 5.1 Overview

How long does it take to recover one point of energy (stamina)?

How long will it take to restore your energy to 100%?

This section has two parts:
 - Focus mode
:::figure rows image=center width=80% blocks=77%,23%
![Energy recovery in Focus mode](/assets/help/energy/er/er_all.png)


Time needed to recover one energy point.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy recovery in grid mode](/assets/help/energy/er/er_all_g.png)


Chart settings and calculator.

---

Time needed to recover one energy point.

:::

<!-- anchor:tp_p5_2 -->
### 5.2 Settings and calculator

:::figure side image=left  blocks=25%,25%,50%
![Energy recovery calculator](/assets/help/energy/er/er_cal.png)

Set the skipper's current energy (stamina) (%).

---

Set True Wind Speed (kts).

---
Read the energy to recover (%), the required recovery time
and the recovery time per energy point.

*Note: These values are identical to those shown on the chart.*

:::
### 5.3 Chart features
:::figure side width=60% 
![Energy recovery chart](/assets/help/energy/er/er_curve.png)

Green: time needed per energy point.

---

Show or hide a curve by clicking its manoeuvre name.

---

After zooming in, hold the left mouse button to pan the chart.

---

Use the mouse wheel to zoom in and out of the chart.

---

Use the 'reset zoom' button to restore the initial view.

:::

Hover over the curve to display a tooltip like this:

:::figure side half
![Energy recovery tooltip](/assets/help/energy/er/er_tooltip.png)

True Wind Speed (knots).

---

Time needed per energy point.
:::

<!-- anchor:tp_p5_3 -->

