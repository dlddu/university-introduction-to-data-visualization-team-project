import { ratingIndex, teamIndex } from "../constant.js";

export const drawRating = (root, teamScale, ratingScale, data) => {
  root
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 7)
    .attr("cx", (d) => ratingScale(d[ratingIndex]))
    .attr("cy", (d) => teamScale(d[teamIndex]) + teamScale.bandwidth() / 2);
};
