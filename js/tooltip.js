import {
  ageIndex,
  ratingIndex,
  chartWidth,
  chartHeight,
  chartMargin,
  salaryIndex,
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

  drawAgeAxis(svg.append("g"), ageScale);
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

function drawAgeAxis(root, ageScale) {
  const ageAxis = d3.axisBottom(ageScale);
  root.attr("transform", `translate(0, ${chartHeight})`).call(ageAxis);
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
