# Automatic sails tutorial

<!-- anchor:tp_p1 -->
## 1. Page overview

The game's automatic sail management means we do not have to change sails manually.

Several factors determine when a sail changes:

- The boat's options (foils / hull polish).

- The available sails.

- Wind speed (TWS) and its variations.

- Wind angle (TWA) and its variations.

A so-called "overspeed" coefficient is applied to the sail's speed to avoid unwanted sail changes.

In practice, in "automatic sails" mode, the game changes sails only if the speed achieved with the new sail is more than 1.4% higher than the current sail's speed.

Sails therefore have overlapping usage zones.

ITYC.fr provides this calculator to help you analyse boat polars more easily.

The data appears once you select a boat.

:::figure rows image=center width=100% blocks=68%,20%,12%
![Penalties overview](/assets/help/autosail/entete/autosail_entete.png)


Boat selection.

---

Polar update date.

---

Display mode.

:::
:::figure rows image=center width=100% blocks=41%,59% 


Packs / Options

---

Sails.

:::

ITYC.FR provides two page layouts:
- Focus mode: one chart per page for better visibility.
- Grid mode: two charts per page for a more compact layout.

<!-- anchor:tp_p1_1 -->
### 1.1 Focus mode
:::figure side image=left width=75%
![Polar overview in Focus mode](/assets/help/autosail/autosail_all.png)

Active sail as a function of wind speed (TWS) at a fixed wind angle (TWA).

---

Active sail as a function of wind angle (TWA) at a fixed wind speed (TWS).

---

A sail's usage range as a function of wind speed (TWS) and wind angle (TWA).

---

Overlap zone between sails as a function of wind speed (TWS) and wind angle (TWA).


:::

<!-- anchor:tp_p1_1_2 -->
### 1.2 Grid mode

:::figure side image=left width=64% 
![Polar overview in Grid mode](/assets/help/autosail/autosail_all_g.png)


Active sail as a function of wind speed (TWS) at a fixed wind angle (TWA).


Active sail as a function of wind angle (TWA) at a fixed wind speed (TWS).

---

A sail's usage range as a function of wind speed (TWS) and wind angle (TWA).


Overlap zone between sails as a function of wind speed (TWS) and wind angle (TWA).


:::

<!-- anchor:tp_p2 -->
## 2. Boat selection

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
## 3. Option selection
:::figure rows image=center width=100% blocks=41%,59%
![Overview](/assets/help/polar/entete/polar_enteteOptions.png)


The area for managing options and packs.

---

The area for enabling or disabling each sail.

:::

### 3.1 Options and Packs

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

### 3.2 Sails

:::figure rows image=center width=70%
![Sails](/assets/help/polar/entete/polar_enteteVoile.png)

In this section, you can enable or disable each sail independently.

For ease of use, the abbreviation of each sail's English name is shown in parentheses.
:::

## 6. Active sail - fixed TWA
### 6.1 Overview
Does my router suggest changing sails for one hour? Is switching temporarily to an intermediate sail worthwhile?

Can the overlap coefficient cover these cases and avoid the sail change and its associated penalties?

ITYC.fr provides this tool to help you answer these questions in just a few clicks!

This section has two parts:

:::figure rows image=center width=80% blocks=80%,20%
![Energy loss in Focus mode](/assets/help/autosail/curve/autosail_twa_all.png)


Boat speed over the TWS range at the specified TWA.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy loss in Grid mode](/assets/help/autosail/curve/autosail_twa_all_g.png)


Chart settings and calculator.

---

Boat speed over the TWS range at the specified TWA.

:::

### 6.2 Settings
:::figure side image=left  width=30% blocks=17%,19%,40%,24%
![Energy loss calculator](/assets/help/autosail/curve/autosail_twa_set.png)

Select the active sail.

---

Set your TWA (°).

---

Set the TWS range (kts).


---

Read the TWS range for the selected sail at the chosen TWA.

:::

### 6.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/autosail/curve/autosail_twa_curve.png)

The charts show boat speed in knots as a function of wind speed at the specified TWA.

The "Theo" curve shows boat speed with the manually selected sail, without applying the overlap coefficient.

The "Auto" curve shows boat speed with the automatically selected sail, applying the overlap coefficient.

The Manu curve shows boat speed with the selected sail.

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

The hatched area represents the sails' overlap zone.


:::figure side
![Sail chart](/assets/help/autosail/autoSailZoom.png)

For example,

---

From point 1, the spinnaker (light green) overlaps Code 0 (dark green).

---

From point 2, it also overlaps part of the heavy spinnaker's range (dark red).

---

Finally, from point 3, the sail change takes place and the heavy spinnaker is set.
:::

Hover over the curve to display a tooltip like this:

:::figure side width=40% blocks=25%,75%
![Energy loss tooltip](/assets/help/autosail/curve/autosail_twa_tooltip.png)

Wind speed (knots).

---

Boat speed (knots), sail and, where applicable, the gain from overlap compared with the theoretical curve.

:::


## 7. Active sail - fixed TWS
### 7.1 Overview
Does my router suggest changing sails for one hour? Is switching temporarily to an intermediate sail worthwhile?

Can the overlap coefficient cover these cases and avoid the sail change and its associated penalties?

ITYC.fr provides this tool to help you answer these questions in just a few clicks!

This section has two parts:

:::figure rows image=center width=80% blocks=80%,20%
![Energy loss in Focus mode](/assets/help/autosail/curve/autosail_tws_all.png)


Boat speed over the TWA range at the specified TWS.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy loss in Grid mode](/assets/help/autosail/curve/autosail_tws_all_g.png)


Chart settings and calculator.

---

Boat speed over the TWA range at the specified TWS.

:::

### 7.2 Settings
:::figure side image=left  width=30% blocks=17%,19%,40%,24%
![Energy loss calculator](/assets/help/autosail/curve/autosail_tws_set.png)

Select the active sail.

---

Set your TWS (kts).

---

Set the TWA range (°).


---

Read the TWA range for the selected sail at the chosen TWS.

:::

### 7.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/autosail/curve/autosail_tws_curve.png)

The charts show boat speed in knots as a function of TWA at the specified wind speed.

The "Theo" curve shows boat speed with the manually selected sail, without applying the overlap coefficient.

The "Auto" curve shows boat speed with the automatically selected sail, applying the overlap coefficient.

The Manu curve shows boat speed with the selected sail.

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

The hatched area represents the sails' overlap zone.

:::figure side
![Sail chart](/assets/help/autosail/autoSailZoom.png)

For example,

---

From point 1, the spinnaker (light green) overlaps Code 0 (dark green).

---

From point 2, it also overlaps part of the heavy spinnaker's range (dark red).

---

Finally, from point 3, the sail change takes place and the heavy spinnaker is set.
:::

Hover over the curve to display a tooltip like this:

:::figure side width=40% blocks=25%,75%
![Energy loss tooltip](/assets/help/autosail/curve/autosail_tws_tooltip.png)

Wind speed (knots).

---

Boat speed (knots), sail and, where applicable, the gain from overlap compared with the theoretical curve.

:::


## 8. Sail usage range
### 8.1 Overview
Want to view a sail's usage zone as a function of wind speed (TWS) and wind angle (TWA)?

ITYC.fr provides this tool!

This section has two parts:

:::figure rows image=center width=80% blocks=80%,20%
![Energy loss in Focus mode](/assets/help/autosail/curve/autosail_zu_all.png)


Upper and lower wind angle (TWA) limits for a given sail.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy loss in Grid mode](/assets/help/autosail/curve/autosail_zu_all_g.png)


Chart settings and calculator.

---

Upper and lower wind angle (TWA) limits for a given sail.

:::

### 8.2 Settings
:::figure side image=left  width=30% 
![Energy loss calculator](/assets/help/autosail/curve/autosail_zu_set.png)

Select the active sail.

:::

### 8.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/autosail/curve/autosail_zu_curve.png)

The charts show the minimum and maximum wind angle (TWA) limits in degrees as a function of wind speed in knots for a given sail.

The "Max TWA" curve shows the wind angle (TWA) limit above which the sail must change, including overlap.

The "Min TWA" curve shows the wind angle (TWA) limit below which the sail must change, including overlap.

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

:::figure side width=40% blocks=25%,75%
![Energy loss tooltip](/assets/help/autosail/curve/autosail_zu_tooltip.png)


Wind speed (knots).

---

Maximum wind angle (°), boat speed (kts).

---

Minimum wind angle (°), boat speed (kts).

:::

## 8. Overlap zone between sails
### 8.1 Overview
Want to view the overlap zone between two sails as a function of wind speed (TWS) and wind angle (TWA)?

ITYC.fr provides this tool!

This section has two parts:

:::figure rows image=center width=80% blocks=80%,20%
![Energy loss in Focus mode](/assets/help/autosail/curve/autosail_zr_all.png)


Upper and lower wind angle (TWA) limits of the overlap between the two sails.

---

Chart settings and calculator.

:::
 - Grid mode
:::figure side image=left width=60% blocks=20%,80%
![Energy loss in Grid mode](/assets/help/autosail/curve/autosail_zr_all_g_b.png)


Chart settings and calculator.

---

Upper and lower wind angle (TWA) limits of the overlap between the two sails.

:::

### 8.2 Settings
:::figure side image=left  width=30% 
![Energy loss calculator](/assets/help/autosail/curve/autosail_zr_set.png)

Select the first sail.

---

Select the second sail.

---

Select the search precision on the TWS and TWA axes.
:::

### 8.3 Chart features
:::figure side width=60% 
![Energy loss chart](/assets/help/autosail/curve/autosail_zr_curve.png)

The curves outline a wind angle (TWA) zone as a function of wind speed for a given sail.

The "Max TWA" curve shows the wind angle (TWA) limit above which the sail changes, including overlap.

The "Min TWA" curve shows the wind angle (TWA) limit below which the sail changes, including overlap.

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

:::figure side width=40% blocks=25%,75%
![Energy loss tooltip](/assets/help/autosail/curve/autosail_zr_tooltip.png)


Wind speed (knots).

---

Maximum wind angle (°), boat speed (kts).

---

Minimum wind angle (°), boat speed (kts).

:::