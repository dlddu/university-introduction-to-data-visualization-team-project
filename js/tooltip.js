import {
  ageIndex,
  ratingIndex,
  chartWidth,
  chartHeight,
  chartMargin,
  salaryIndex,
  teamIndex,
} from "./tooltip/constant.js";
import { drawRating } from "./tooltip/rating.js";
import { drawSalary } from "./tooltip/salary.js";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", chartWidth + chartMargin * 4)
  .attr("height", chartHeight + chartMargin * 2)
  .append("g")
  .attr("transform", `translate(${chartMargin}, ${chartMargin})`);

d3.csv("/data/sample.csv").then(convertStringDataToFloat).then(showChart);

function showChart(data) {
  const ageScale = getAgeScale(data);

  drawAgeAxis(svg.append("g"), ageScale, data);
  drawSalary(svg.append("g"), ageScale, data);
  drawRating(svg.append("g"), ageScale, data);

  drawAgeAxisTitle(svg);
  drawRatingAxisTitle(svg);
  drawSalaryAxisTitle(svg);
}

// Title ///////////////////////////////////////////////////////////////////

function drawAgeAxisTitle(root) {
  root
    .append("text")
    .text("Age")
    .attr("text-anchor", "end")
    .attr("x", chartWidth + 20)
    .attr("y", chartHeight + 30);
}

function drawRatingAxisTitle(root) {
  root.append("text").text("Rating").attr("text-anchor", "end").attr("y", -20);
}

function drawSalaryAxisTitle(root) {
  root
    .append("text")
    .text("Salary")
    .attr("text-anchor", "end")
    .attr("x", chartWidth + 50)
    .attr("y", -20);
}

// Age /////////////////////////////////////////////////////////////////////

function drawTeamAxis(root, data) {
  const teamScale = d3
    .scaleBand()
    .domain(data.map((d) => `${d[ageIndex]}<br>${d[teamIndex]}`))
    .range([0, chartWidth])
    .padding(0.2)
    .paddingInner(0.2);

  const teamAxis = d3.axisBottom(teamScale);
  root.attr("transform", `translate(0, ${chartHeight})`).call(teamAxis);
}

function drawAgeAxis(root, ageScale, data) {
  const ageAxis = root
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(ageScale));

  // Render teams under age label
  const teams = [...data.map((d) => d[teamIndex])];
  const filledTeams = [
    ...teams.slice(0, 1),
    "",
    ...teams.slice(1, teams.length),
  ];

  ageAxis.selectAll("text").each(function (_, i) {
    d3.select(this.parentNode)
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .text((_) => filledTeams[i]);
  });
}

function getAgeScale(data) {
  return d3
    .scaleBand()
    .domain(startAndEndToRange(d3.extent(data.map((d) => d[ageIndex]))))
    .range([0, chartWidth])
    .padding(0.2)
    .paddingInner(0.2);
}

// Utility /////////////////////////////////////////////////////////////////

function convertStringDataToFloat(data) {
  return data.map(convertStringToFloat);
}

function convertStringToFloat(row) {
  const copy = {
    ...row,
  };
  copy[ageIndex] = parseInt(row[ageIndex]);
  copy[ratingIndex] = parseFloat(row[ratingIndex]);
  copy[salaryIndex] = parseInt(row[salaryIndex]);
  return copy;
}

function startAndEndToRange([start, end]) {
  return Array(end - start + 1)
    .fill(start)
    .map((value, i) => value + i);
}
