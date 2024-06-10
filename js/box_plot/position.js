import { positionFlags } from "../common/constant.js";

export const drawPositionLegend = (root, positionScale, reloadDataAction) => {
  const legend = d3
    .legendColor()
    .shape("square")
    .shapePadding(100)
    .orient("horizontal")
    .scale(positionScale);

  const legendAxis = root.call(legend).attr("transform", `translate(150, -30)`);

  legendAxis
    .selectAll(".label")
    .attr("transform", `translate(25, 12.5)`)
    .attr("style", null);

  legendAxis
    .selectAll(".cell")
    .on("click", (_, d) => {
      togglePosition(d, reloadDataAction);
    })
    .selectAll(".swatch")
    .style("opacity", (d) => (positionFlags[d] ? 1 : 0.3));
};

function togglePosition(data, reloadDataAction) {
  positionFlags[data] = !positionFlags[data];
  reloadDataAction();
}
