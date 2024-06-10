import {
  idIndex,
  tooltipWidth,
  tooltipHeight,
  tooltipMargin,
  teamIndex,
  ageIndex,
  positionIndex,
  positionToColor,
} from "../constant.js";
import { showTooltip } from "../tooltip.js";

export const drawPlayer = (root, teamScale, ageScale, data) => {
  // Draw dots
  const circles = root
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 7)
    .attr("cx", (d) => ageScale(d[ageIndex]))
    .attr("cy", (d) => teamScale(d[teamIndex]) + teamScale.bandwidth() / 2)
    .attr("fill", (d) => positionToColor[d[positionIndex]]);

  // Draw tooltip
  circles
    .on("mouseover", (_, d) => {
      const tooltipRoot = d3
        .select("#tooltip")
        .style("display", "block")
        .append("svg")
        .attr("width", tooltipWidth + tooltipMargin * 2.5)
        .attr("height", tooltipHeight + tooltipMargin * 2)
        .append("g")
        .attr("transform", `translate(${tooltipMargin}, ${tooltipMargin})`);

      showTooltip(tooltipRoot, d[idIndex]);
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
