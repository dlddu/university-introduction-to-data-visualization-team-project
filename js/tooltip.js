import { ageIndex, ratingIndex } from "./tooltip/columnIndex.js";
import { drawRating } from "./tooltip/rating.js";

const width = 700;
const height = 400;
const margin = 50;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin * 2)
  .attr("height", height + margin * 2)
  .append("g")
  .attr("transform", `translate(${margin}, ${margin})`);

d3.csv("/data/sample.csv").then(convertStringDataToFloat).then(showChart);

function showChart(data) {
  // Draw age
  const ageScale = d3
    .scaleBand()
    .domain(startAndEndToRange(d3.extent(data.map((d) => d[ageIndex]))))
    .range([0, width]);
  const ageAxis = d3.axisBottom(ageScale);
  svg.append("g").call(ageAxis).attr("transform", `translate(0, ${height})`);

  // Draw other
  const root = svg.append("g").selectAll("g").data(data).enter();

  const ratingExtent = d3.extent(data.map((d) => d[ratingIndex]));
  const ratingGap = (ratingExtent[1] - ratingExtent[0]) / 2;
  drawRating(
    ratingExtent[1] + ratingGap,
    ratingExtent[0] - ratingGap,
    height,
    svg,
    root,
    ageScale
  );
}

function convertStringDataToFloat(data) {
  return data.map(convertStringToFloat);
}

function convertStringToFloat(row) {
  const copy = {
    ...row,
  };
  copy[ageIndex] = parseInt(row[ageIndex]);
  copy[ratingIndex] = parseFloat(row[ratingIndex]);
  return copy;
}

function startAndEndToRange([start, end]) {
  return Array(end - start + 1)
    .fill(start)
    .map((value, i) => value + i);
}
