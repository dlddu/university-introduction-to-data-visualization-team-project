import {
  ageIndex,
  chartWidth,
  chartHeight,
  chartMargin,
  teamIndex,
  year,
} from "./common/constant.js";
import { drawPlayer } from "./box_plot/player.js";
import { drawBoxPlot } from "./box_plot/box_plot.js";
import { loadAllData, loadData } from "./common/data_loader.js";
import { drawPositionLegend } from "./box_plot/position.js";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", chartWidth + chartMargin * 4)
  .attr("height", chartHeight + chartMargin * 3)
  .append("g")
  .attr("transform", `translate(${chartMargin * 2}, ${chartMargin})`);

drawSlider();
showChart();

function drawSlider() {
  const slider = d3
    .sliderBottom()
    .min(2019)
    .max(2023)
    .marks([2019, 2021, 2022, 2023])
    .width(300)
    .tickFormat(d3.format("d"))
    .tickValues(["2019", "2021", "2022", "2023"])
    .on("onchange", () => {
      year.value = slider.value();
      showChart();
    });

  svg
    .append("g")
    .attr("transform", `translate(${-50}, ${chartHeight + chartMargin})`)
    .attr("viewBox", [-20, -20, 340, 60])
    .attr("width", 340)
    .attr("height", 60)
    .call(slider);
}

async function showChart() {
  svg.selectAll(".chart").remove();
  const root = svg.append("g").attr("class", "chart");
  const data = await loadData();
  const ageScale = await getAgeScale();
  const teamScale = getTeamScale(data);
  const positionScale = getPositionScale();

  drawAgeAxis(root.append("g"), ageScale);
  drawTeamAxis(root.append("g"), teamScale);

  drawPlayer(root.append("g"), data, ageScale, teamScale, positionScale);
  drawBoxPlot(root.append("g"), data, ageScale, teamScale);
  drawPositionLegend(root.append("g"), positionScale, showChart);

  drawAgeAxisTitle(root);
  drawTeamAxisTitle(root);
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

async function getAgeScale() {
  const allData = await loadAllData();
  const extent = d3.extent(allData.map((d) => d[ageIndex]));
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

function getPositionScale() {
  return d3
    .scaleOrdinal()
    .domain(["GK", "FW", "DF", "MF"])
    .range(["#316f1d", "#0b224c", "#f2c43c", "#df5e26"]);
}

function drawAgeAxis(root, ageScale) {
  const domain = ageScale.domain();
  let ticks = domain[1] - domain[0];
  while (ticks > 20) ticks = ticks / 2;
  const ageAxis = root
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(ageScale).ticks(ticks).tickSizeInner(-chartHeight));
  ageAxis.selectAll("path").style("stroke", "#EEEEEE");
  ageAxis.selectAll("line").style("stroke", "#EEEEEE");
  ageAxis.selectAll("text").style("color", "#777777");
}

function drawTeamAxis(root, teamScale) {
  const teamAxis = root
    .attr("transform", `translate(0, 0)`)
    .call(d3.axisLeft(teamScale).tickSizeInner(-chartWidth));
  teamAxis.selectAll("path").style("stroke", "transparent");
  teamAxis.selectAll("line").style("stroke", "#EEEEEE");
}
