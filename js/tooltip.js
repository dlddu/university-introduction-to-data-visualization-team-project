import { drawAge } from "./tooltip/rating.js";

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

d3.csv("/data/sample.csv").then(showChart);

function showChart(data) {
  const ageScale = d3
    .scaleBand()
    .domain(data.map((d) => d["Age"]))
    .range([0, width])
    .padding(0.5)
    .paddingInner(0.5);
  const ageAxis = d3.axisBottom(ageScale);
  svg.append("g").call(ageAxis).attr("transform", `translate(0, ${height})`);

  const root = svg.append("g").selectAll("g").data(data).enter();

  drawAge(height, svg, ageScale, root);
}
