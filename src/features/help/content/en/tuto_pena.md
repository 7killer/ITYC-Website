# Penalties tutorial

<!-- anchor:tp_p1 -->
## 1. Page overview
<!-- anchor:penalties-overview -->
### 1.1 Overview

Manoeuvres are an important part of Virtual Regatta, and the associated penalties can be substantial.

ITYC.fr provides this calculator to show the time and distance lost during these manoeuvres.

The data is displayed after you select a boat.

*Note: Adjust settings with the slider or your keyboard arrow keys, or enter values directly (using either ',' or '.' as the decimal separator).*

:::figure rows image=center width=100% blocks=23%,40%,22%,15%
![Penalties page overview](/assets/help/penalties/pena_vueensembleEntete.png)


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

<!-- anchor:penalties-chart-controls -->
### 1.2 Chart controls

<!-- anchor:penalties-display-mode -->
#### 1.2.1 Display mode
You can switch display modes in two ways:

* Using the selector at the top of the page ![Description](/assets/help/common/focusgrille.png "icon:2.5em")
* Using the buttons on each chart
  * Switch from Focus to Grid mode ![Description](/assets/help/common/modeGrilleCurve.png "icon:2.5em")
  * Switch from Grid to Focus mode ![Description](/assets/help/common/modeFocusCurve.png "icon:2.5em")


*When switching modes, the page scrolls automatically to keep the current chart in view.*

<!-- anchor:penalties-reset-zoom -->
#### 1.2.2 Reset zoom

You can reset a chart's zoom at any time by pressing the button ![Description](/assets/help/common/resetZoom.png "icon:2.5em")

<!-- anchor:penalties-help-shortcut -->
#### 1.2.3 Help shortcut

You can open the help for the current chart at any time by clicking this button ![Description](/assets/help/common/aide.png "icon:2.5em")

<!-- anchor:penalties-precision -->
#### 1.2.4 Precision

For every chart with TWS on the X axis, you can choose a calculation step of 0.1 or 0.01.
* Click this button ![Description](/assets/help/common/precision10.png "icon:2.5em") to switch the calculation to 0.01 precision.
* Click this button ![Description](/assets/help/common/precision100.png "icon:2.5em") to switch the calculation to 0.1 precision.

*A precision of 0.01 requires more calculation time.*

<!-- anchor:penalties-focus-mode -->
### 1.3 Focus mode
:::figure side image=left width=75% blocks=33%,33%,34%
![Penalties page overview in focus mode](/assets/help/penalties/pena_vueensemble.png)

Simple penalties.

---

Break-even point of a manoeuvre.

---

Double penalties.
:::

<!-- anchor:tp_p1_1_2 -->
### 1.4 Grid mode

:::figure side image=left width=75% blocks=50%,50%
![Penalties page overview in grid mode](/assets/help/penalties/pena_vueensemble_g.png)

Simple penalties / Manoeuvre break-even point.

---

Double penalties.
:::

<!-- anchor:tp_p2 -->
## 2. Boat selection

:::figure side 
![2. Boat selection on ITYC](/assets/help/common/select_boat_ityc.png)
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
![Equipment selection](/assets/help/penalties/pena_options.png)

Enable Winch if your boat has Winch Pro.

Enable Furler if your boat has Magic Furler.

Enable Jacket if your boat has the VRtex Jacket.

:::

<!-- anchor:tp_p4 -->
## 4. Simple penalties

<!-- anchor:tp_p4_1 -->
### 4.1 Overview

How much penalty time applies to a sail change, and how much distance will you lose during a manoeuvre?

Do you want to know whether the manoeuvre will pay off?

How much did an unintended manoeuvre cost you?

*Note: When the tack and gybe manoeuvre parameters are identical, their curves are combined.*

This section has two parts:
 - Focus mode
:::figure rows image=center width=80% blocks=77%,23%
![Simple penalties in focus mode](/assets/help/penalties/PS/pena_simple_all.png)


Penalty curve for each manoeuvre type.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=25%,75%
![Simple penalties in grid mode](/assets/help/penalties/PS/pena_simple_all_g.png)


Chart settings and calculator.

---

Penalty curve for each manoeuvre type.

:::

<!-- anchor:tp_p4_3 -->
### 4.2 Settings and calculator

:::figure side image=left  blocks=18%,17%,28%,15%,22%
![Simple penalty calculator](/assets/help/penalties/PS/pena_simple_cal.png)


Set the skipper's energy (stamina) in %.

---

Set True Wind Speed (kts).

---

Read the penalty time for each manoeuvre type (minutes and seconds).

*Note: These values are identical to those shown on the chart.*

---

Set your boat speed (kts).

---

Read the distance lost for each manoeuvre type (nautical miles).

:::

<!-- anchor:tp_p4_2 -->
### 4.3 Chart features
:::figure side width=60% 
![Simple penalty chart](/assets/help/penalties/PS/pena_simple_curve.png)

Green: penalty time for a tack or gybe.

Red: penalty time for a sail change.

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

:::figure side 
![Simple penalty tooltip](/assets/help/penalties/PS/pena_simple_tooltip.png)

True Wind Speed (knots).

---

Applied penalty time.
:::


<!-- anchor:tp_p5 -->
## 5. Break-even point of a sail change
<!-- anchor:tp_p5_1 -->
### 5.1 Overview

Should you change sail for just one hour, or when you are only two miles from the finish? Is it worthwhile?

This ITYC.fr tool answers these questions in just a few clicks.

For performance reasons, the calculation is limited to the first 12 hours.

On a screen that is too small, the curve will not be displayed.

This section has two parts:

 - Focus mode
:::figure rows image=center width=80% blocks=77%,23%
![Break-even chart in focus mode](/assets/help/penalties/RT/pena_Renta_all.png)


Distance travelled, with and without a sail change.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=25%,75%
![Break-even chart in grid mode](/assets/help/penalties/RT/pena_Renta_all_g.png)


Chart settings and calculator.

---

Distance travelled, with and without a sail change.

:::

<!-- anchor:tp_p5_3 -->
### 5.2 Settings and calculator

:::figure side image=left  blocks=15%,15%,20%,15%,15%,20%
![Break-even calculator](/assets/help/penalties/RT/pena_Renta_cal.png)


Set the skipper's energy (stamina) in %.

---

Set True Wind Speed (kts).

---

Read the penalty time (minutes and seconds).

---

Average boat speed without a sail change (kts).

---

Average boat speed with a sail change (kts).

---

The time and distance at which the sail change pays off: the point when you overtake a boat that did not change sail.

:::

<!-- anchor:tp_p5_2 -->
### 5.3 Chart features
:::figure side width=60% 
![Break-even chart](/assets/help/penalties/RT/pena_Renta_curve.png)

Green: distance without a sail change.

Blue: distance with a sail change.

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

:::figure side 
![Break-even tooltip](/assets/help/penalties/RT/pena_Renta_tooltip.png)

Time elapsed since the start of the manoeuvre, in seconds.

---

Distance travelled in nautical miles.
:::

<!-- anchor:tp_p6 -->
## 6 Double penalties

<!-- anchor:tp_p6_1 -->
### 6.1 Overview

Sometimes a sail change happens at the same time as a gybe or tack. How much penalty time applies, and how much distance will you lose?

How much did an unintended manoeuvre cost you?

This section has two parts:

 - Focus mode
:::figure rows image=center width=80% blocks=77%,23%
![Double penalties in focus mode](/assets/help/penalties/PD/pena_double_all.png)


Penalty curve for each manoeuvre type.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Double penalties in grid mode](/assets/help/penalties/PD/pena_double_all_g.png)


Chart settings and calculator.

---

Penalty curve for each manoeuvre type.

:::

<!-- anchor:tp_p6_3 -->
### 6.2 Settings and calculator

:::figure side image=left  blocks=18%,17%,28%,15%,22%
![Double penalty calculator](/assets/help/penalties/PD/pena_double_cal.png)


Set the skipper's energy (stamina) in %.

---

Set True Wind Speed (kts).

---

Read the penalty time for each manoeuvre type (minutes and seconds).

*Note: These values are identical to those shown on the chart.*

---

Set your boat speed (kts).

---

Read the distance lost.

:::
<!-- anchor:tp_p6_2 -->
### 6.3 Chart features
:::figure side width=60% 
![Double penalty chart](/assets/help/penalties/RT/pena_Renta_curve.png)

Green: penalty time for a tack or gybe combined with a sail change.

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
![Double penalty chart](/assets/help/penalties/PD/pena_double_tooltip.png)

True Wind Speed (kts).

---

Applied penalty time.
:::


