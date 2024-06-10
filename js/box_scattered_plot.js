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
import { drawPlayer } from "./box_plot/player.js";
import { drawBoxPlot } from "./box_plot/box_plot.js";

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

  drawPlayer(svg.append("g"), teamScale, ageScale, data);
  Array.from(new Set(data.map((d) => d[teamIndex]))).forEach((team) => {
    {
      const ages = Array.from(
        new Set(
          data.filter((d) => d[teamIndex] == team).map((d) => d[ageIndex])
        )
      );
      if (ages.length < 5) return;
      drawBoxPlot(
        svg.append("g"),
        data.filter((d) => d[teamIndex] == team).map((d) => d[ageIndex]),
        ageScale,
        teamScale,
        team
      );
    }
  });

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
  const extent = d3.extent(data.map((d) => d[ageIndex]));
  const gap = extent[1] - extent[0];
  const padding = Math.ceil(gap * 0.03);

  return d3
    .scaleLinear()
    .domain([extent[0] - padding, extent[1] + padding])
    .range([0, chartWidth])
    .clamp(true);
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
  const domain = ageScale.domain();
  let ticks = domain[1] - domain[0];
  while (ticks > 20) ticks = ticks / 2;
  console.log(ticks);
  const ageAxis = root
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(ageScale).ticks(ticks).tickSizeInner(-chartHeight));
  ageAxis.selectAll("path").style("stroke", "#EEEEEE");
  ageAxis.selectAll("line").style("stroke", "#EEEEEE");
  ageAxis.selectAll("text").style("color", "#777777");
}

function drawTeamAxis(root, teamScale) {
  const teamAxis = root
    .attr("transform", `0, 0)`)
    .call(d3.axisLeft(teamScale).tickSizeInner(-chartWidth));
  teamAxis.selectAll("path").style("stroke", "transparent");
  teamAxis.selectAll("line").style("stroke", "#EEEEEE");
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
