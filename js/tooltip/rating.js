export const drawAge = (height, svg, ageScale, root) => {
  const ratingScale = d3.scaleLinear().domain([10, 0]).range([0, height]);
  const ratingAxis = d3.axisLeft(ratingScale);
  svg.append("g").call(ratingAxis);

  root
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => ageScale(d["Age"]))
    .attr("cy", (d) => ratingScale(d["Rating"]));
};
