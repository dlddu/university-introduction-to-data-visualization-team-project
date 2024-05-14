import { ageIndex, ratingIndex } from "./columnIndex.js";

export const drawRating = (
  maximumRatingRange,
  minimumRatingRange,
  height,
  svg,
  root,
  ageScale
) => {
  const ratingScale = d3
    .scaleLinear()
    .domain([maximumRatingRange, minimumRatingRange])
    .range([0, height]);
  const ratingAxis = d3.axisLeft(ratingScale);
  svg.append("g").call(ratingAxis);

  root
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => ageScale(d[ageIndex]) + ageScale.bandwidth() / 2)
    .attr("cy", (d) => ratingScale(d[ratingIndex]));
};
