# New interface

Additional features in the new ITYC interface.

<!-- anchor:interface-vmg-selected-conditions -->
## VMG for selected conditions

Read progress calculated for the current TWA and TWS.

<!-- anchor:interface-vmg-measurement -->
### What VMG measures

VMG is the useful component of boat speed along the wind axis: it describes progress, not only speed through the water. It depends on TWA, TWS, boat, options and active sail.

![What VMG measures](/assets/help/polar/curve/polar_expert_All.png)

<!-- anchor:interface-vmg-optimal-angles -->
### Compare with optimal angles

Compare current VMG with upwind and downwind BVMG to see whether the chosen angle is close to the best progress angle. Best Speed answers a different question: maximum raw speed.

<!-- anchor:interface-grid-focus -->
## Grid and focus modes

Arrange polar charts to suit your analysis.

<!-- anchor:interface-grid -->
### Grid mode

Grid mode shows several charts together so you can compare their trends. On wide screens it keeps indicators side by side; on smaller screens, scroll to browse them.

![Grid mode](/assets/help/polar/polar_viewall_g.png)

<!-- anchor:interface-focus -->
### Focus mode

Focus mode enlarges one chart for closer inspection. Use a card’s expand button to enter focus, then its grid button to return to the overview.

![Focus mode](/assets/help/polar/curve/polar_twa_curve.png)

<!-- anchor:interface-normal-expert -->
### Choose Normal or Expert

Normal mode includes speed curves, BVMG, Best Speed, VMG and sail usage. Expert mode adds a visual polar, detailed automatic-sail views and a deeper presentation of results.

<!-- anchor:interface-saved-settings -->
### Saved settings

Boat, selected sails, options, analysis level and layout are saved in your browser so you can return to your setup later.

<!-- anchor:interface-sail-usage-map -->
## “Sail usage” map

Find the fastest sail for each TWS and TWA.

<!-- anchor:interface-sail-usage-reading -->
### Reading the map

The map plots wind conditions on two axes: TWS horizontally and TWA vertically. Each coloured region represents the fastest sail among those selected for those conditions. Colours match the curves.

![Reading the map](/assets/help/polar/curve/polar_bsail_curve.png)

<!-- anchor:interface-sail-usage-speed-contours -->
### Speed contours

Lines and their labels mark boat-speed levels. They help identify areas where speed changes quickly or stays similar as the wind shifts.

<!-- anchor:interface-sail-usage-explore -->
### Explore conditions

Hover over the map to see TWS, TWA, the corresponding sail and calculated speed. Zoom or pan to inspect an area, then reset the map from its chart button.

<!-- anchor:interface-sail-usage-settings -->
### What affects the map

Boat, options and selected sails determine the map results. The TWS and TWA sliders on the speed charts do not change it; they only affect their neighbouring speed charts.

<!-- anchor:interface-expert-polar -->
## Expert mode and visual polar

Explore sail, angle and performance details.

<!-- anchor:interface-expert-views -->
### Additional views

Expert mode supplements standard charts with a visual polar in TWS/TWA coordinates, automatic-sail curves and detailed results. The visual polar displays wind conditions in the familiar fan-shaped view.

![Additional views](/assets/help/polar/curve/polar_expert_All.png)

<!-- anchor:interface-expert-layers -->
### Show or hide layers

Use the Expert panel display options to show or hide sails, foils or automatic-sail information. This can make overlapping details easier to read.

<!-- anchor:interface-expert-standard-curves -->
### Compare with standard curves

Automatic views show results for the current TWA or TWS and nearby variations. Detailed BVMG and Best Heading help examine angles and the selected sail more closely.

<!-- anchor:interface-expert-results -->
### Understanding results

Calculations compare selected sails and enabled options. Unselected sails are not included. Results are indicative and depend on the boat polar data.

<!-- anchor:interface-overlap -->
## Overlap zone

Inspect conditions where two sails have similar performance.

<!-- anchor:interface-overlap-sails -->
### Choose two sails

Select the two sails to compare. The chart identifies conditions where the second remains within the automatic-change margin of the selected sail.

![Choose two sails](/assets/help/autosail/curve/autosail_zr_all.png)

<!-- anchor:interface-overlap-margin -->
### Understand the margin

The game avoids constant sail changes: a candidate sail must exceed the current sail by a margin, generally 1.4% in the supplied polars. The value comes from boat data.

<!-- anchor:interface-overlap-precision -->
### Set precision

On each chart with TWS on the X axis, the button before reset zoom shows the active step: 0.1 or 0.01. Clicking changes that chart's precision. Finer precision can detail a transition, with a more intensive calculation. The Expert polar's TWS control uses a 0.01 step.

