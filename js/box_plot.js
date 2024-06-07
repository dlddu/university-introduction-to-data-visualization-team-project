import {
  ageIndex,
  ratingIndex,
  chartWidth,
  chartHeight,
  chartMargin,
  salaryIndex,
  teamIndex,
  yearIndex,
} from "./constant.js";
import { drawAge } from "./box_plot/age.js";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", chartWidth + chartMargin * 4)
  .attr("height", chartHeight + chartMargin * 2)
  .append("g")
  .attr("transform", `translate(${chartMargin * 2}, ${chartMargin})`);

const loadData = d3.csv("/data/sample.csv").then(convertStringDataToFloat);

showChart(await loadData, 2022);

function showChart(loadData, year) {
  const data = loadData.filter((row) => row[yearIndex] == year);
  const ageScale = getAgeScale(data);
  const teamScale = getTeamScale(data);

  drawAgeAxis(svg.append("g"), ageScale);
  drawTeamAxis(svg.append("g"), teamScale);

  drawAge(svg.append("g"), teamScale, ageScale, data);

  drawAgeAxisTitle(svg);
  drawTeamAxisTitle(svg);
}

// Title ///////////////////////////////////////////////////////////////////

function drawAgeAxisTitle(root) {
  root
    .append("text")
    .text("Age")
    .attr("text-anchor", "end")
    .attr("x", chartWidth + 20)
    .attr("y", chartHeight + 40);
}

function drawTeamAxisTitle(root) {
  root
    .append("text")
    .text("Team")
    .attr("text-anchor", "end")
    .attr("x", 5)
    .attr("y", -20);
}

// Axis /////////////////////////////////////////////////////////////////////

function getAgeScale(data) {
  return d3
    .scaleBand()
    .domain(startAndEndToRange(d3.extent(data.map((d) => d[ageIndex]))))
    .range([0, chartWidth]);
}

function getTeamScale(data) {
  return d3
    .scaleBand()
    .domain(data.map((d) => d[teamIndex]))
    .range([0, chartHeight])
    .padding(0.2)
    .paddingInner(0.2);
}

function drawAgeAxis(root, ageScale) {
  root
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(ageScale));
}

function drawTeamAxis(root, teamScale) {
  root.attr("transform", `0, 0)`).call(d3.axisLeft(teamScale));
}

// Preprocess data /////////////////////////////////////////////////////////////////

function convertStringDataToFloat(data) {
  return data.map(convertStringToFloat);
}

function convertStringToFloat(row) {
  const copy = {
    ...row,
  };
  copy[yearIndex] = parseInt(row[yearIndex]);
  copy[ageIndex] = parseInt(row[ageIndex]);
  copy[ratingIndex] = parseFloat(row[ratingIndex]);
  copy[salaryIndex] = parseInt(row[salaryIndex]);
  return copy;
}

// Utility /////////////////////////////////////////////////////////////////

function startAndEndToRange([start, end]) {
  return Array(end - start + 1)
    .fill(start)
    .map((value, i) => value + i);
}
