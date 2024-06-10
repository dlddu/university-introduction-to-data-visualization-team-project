import {
  tooltipWidth,
  tooltipHeight,
  tooltipMargin,
  teamIndex,
  ageIndex,
  positionIndex,
  boxScatteredPlotCircleRadius,
} from "../common/constant.js";
import { showTooltip } from "../tooltip.js";

export const drawPlayer = (root, data, ageScale, teamScale, positionScale) => {
  // Draw dots
  const circles = root
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", boxScatteredPlotCircleRadius)
    .attr("cx", (d) => ageScale(d[ageIndex]))
    .attr("cy", (d) => teamScale(d[teamIndex]) + teamScale.bandwidth() / 2)
    .attr("fill", (d) => positionScale(d[positionIndex].split(",")[0]));

  // Draw tooltip
  circles
    .on("mouseover", (_, d) => {
      const tooltipRoot = d3
        .select("#tooltip")
        .style("display", "block")
        .append("svg")
        .attr("width", tooltipWidth + tooltipMargin * 13)
        .attr("height", tooltipHeight + tooltipMargin * 3)
        .append("g")
        .attr("transform", `translate(${tooltipMargin}, ${tooltipMargin})`);

      showTooltip(tooltipRoot, d);
    })
    .on("mousemove", (event) => {
      d3.select("#tooltip")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    })
    .on("mouseleave", () => {
      d3.select("#tooltip").style("display", "none").select("svg").remove();
    });
};
