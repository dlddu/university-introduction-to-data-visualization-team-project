import { ageIndex, ratingIndex, tooltipHeight } from "../constant.js";

export const drawRating = (root, ageScale, data) => {
  const ratingScale = getScale(data);

  // Draw axis
  root.append("g").call(d3.axisLeft(ratingScale));

  // Draw dots
  root
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => ageScale(d[ageIndex]) + ageScale.bandwidth() / 2)
    .attr("cy", (d) => ratingScale(d[ratingIndex]));

  // Draw line
  const line = getLine(ageScale, ratingScale, data);
  root
    .append("path")
    .attr("d", line)
    .attr("stroke", "black")
    .attr("fill", "transparent");
};

function getLine(ageScale, ratingScale, data) {
  return d3
    .line()
    .x((d) => ageScale(d[ageIndex]) + ageScale.bandwidth() / 2)
    .y((d) => ratingScale(d[ratingIndex]))(data);
}

function getScale(data) {
  // Set domain
  const ratingExtent = d3.extent(data.map((d) => d[ratingIndex]));
  const ratingGap = (ratingExtent[1] - ratingExtent[0]) / 2;
  const maximumRatingRange = ratingExtent[1] + ratingGap;
  const minimumRatingRange = ratingExtent[0] - ratingGap;
  const domain = [maximumRatingRange, minimumRatingRange];

  // Set scale
  return d3.scaleLinear().domain(domain).range([0, tooltipHeight]);
}
