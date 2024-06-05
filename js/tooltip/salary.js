import { ageIndex, salaryIndex, chartHeight, chartWidth } from "../constant.js";

export const drawSalary = (root, ageScale, data) => {
  const salaryScale = d3
    .scaleLinear()
    .domain([0, 10000000])
    .range([chartHeight, 0]);

  root
    .append("g")
    .attr("transform", `translate(${chartWidth}, 0)`)
    .call(d3.axisRight(salaryScale));

  root
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => ageScale(d[ageIndex]))
    .attr("y", (d) => salaryScale(d[salaryIndex]))
    .attr("width", ageScale.bandwidth())
    .attr("height", (d) => chartHeight - salaryScale(d[salaryIndex]))
    .attr("fill", "#69b3a2");

  const mediumValue = (data[0][salaryIndex] + data[1][salaryIndex]) / 2;
  const scaledMediumValue = salaryScale(mediumValue);
  root
    .append("rect")
    .attr("x", ageScale(26))
    .attr("y", scaledMediumValue)
    .attr("width", ageScale.bandwidth())
    .attr("height", (d) => chartHeight - scaledMediumValue)
    .attr("fill", "#FFA500");
};
