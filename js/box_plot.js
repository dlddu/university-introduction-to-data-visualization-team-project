import {
  ageIndex,
  ratingIndex,
  chartWidth,
  chartHeight,
  chartMargin,
  salaryIndex,
  teamIndex,
} from "./constant.js";
import { drawRating } from "./box_plot/rating.js";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", chartWidth + chartMargin * 4)
  .attr("height", chartHeight + chartMargin * 2)
  .append("g")
  .attr("transform", `translate(${chartMargin}, ${chartMargin})`);

d3.csv("/data/sample.csv").then(convertStringDataToFloat).then(showChart);

function showChart(data) {
  const ratingScale = getRatingScale();
  const teamScale = getTeamScale(data);

  drawRatingAxis(svg.append("g"), ratingScale);
  drawTeamAxis(svg.append("g"), teamScale);

  drawRating(svg.append("g"), teamScale, ratingScale, data);

  drawRatingAxisTitle(svg);
  drawTeamAxisTitle(svg);
}

// Title ///////////////////////////////////////////////////////////////////

function drawRatingAxisTitle(root) {
  root
    .append("text")
    .text("Rating")
    .attr("text-anchor", "end")
    .attr("x", chartWidth + 20)
    .attr("y", chartHeight + 40);
}

function drawTeamAxisTitle(root) {
  root
    .append("text")
    .text("Team")
    .attr("text-anchor", "end")
    .attr("x", chartWidth / 2)
    .attr("y", -20);
}

// Axis /////////////////////////////////////////////////////////////////////

function getRatingScale() {
  return d3.scaleLinear().domain([0, 10]).range([0, chartWidth]);
}

function getTeamScale(data) {
  return d3
    .scaleBand()
    .domain(data.map((d) => d[teamIndex]))
    .range([0, chartHeight])
    .padding(0.2)
    .paddingInner(0.2);
}

function drawRatingAxis(root, ratingScale) {
  root
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(ratingScale));
}

function drawTeamAxis(root, teamScale) {
  root
    .attr("transform", `translate(${chartWidth / 2}, 0)`)
    .call(d3.axisLeft(teamScale));
}

// Preprocess data /////////////////////////////////////////////////////////////////

function convertStringDataToFloat(data) {
  const targetYear = 25;

  return data
    .map(convertStringToFloat)
    .filter((row) => row[ageIndex] == targetYear);
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
