import {
  idIndex,
  ageIndex,
  ratingIndex,
  tooltipWidth,
  tooltipHeight,
  salaryIndex,
  teamIndex,
} from "./constant.js";
import { drawRating } from "./tooltip/rating.js";
import { drawSalary } from "./tooltip/salary.js";

const loadData = d3.csv("/data/sample.csv").then(convertStringDataToFloat);

export const showTooltip = async (root, playerId) => {
  const data = (await loadData).filter((d) => d[idIndex] === playerId);
  const ageScale = getAgeScale(data);

  drawAgeAxis(root.append("g"), ageScale, data);
  drawSalary(root.append("g"), ageScale, data);
  drawRating(root.append("g"), ageScale, data);

  drawAgeAxisTitle(root);
  drawRatingAxisTitle(root);
  drawSalaryAxisTitle(root);
};

// Title ///////////////////////////////////////////////////////////////////

function drawAgeAxisTitle(root) {
  root
    .append("text")
    .text("Age")
    .attr("text-anchor", "end")
    .attr("x", tooltipWidth + 20)
    .attr("y", tooltipHeight + 30);
}

function drawRatingAxisTitle(root) {
  root.append("text").text("Rating").attr("text-anchor", "end").attr("y", -20);
}

function drawSalaryAxisTitle(root) {
  root
    .append("text")
    .text("Salary")
    .attr("text-anchor", "end")
    .attr("x", tooltipWidth + 50)
    .attr("y", -20);
}

// Age /////////////////////////////////////////////////////////////////////

function drawTeamAxis(root, data) {
  const teamScale = d3
    .scaleBand()
    .domain(data.map((d) => `${d[ageIndex]}<br>${d[teamIndex]}`))
    .range([0, tooltipWidth])
    .padding(0.2)
    .paddingInner(0.2);

  const teamAxis = d3.axisBottom(teamScale);
  root.attr("transform", `translate(0, ${tooltipHeight})`).call(teamAxis);
}

function drawAgeAxis(root, ageScale, data) {
  const ageAxis = root
    .attr("transform", `translate(0, ${tooltipHeight})`)
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
    .range([0, tooltipWidth])
    .padding(0.2)
    .paddingInner(0.2);
}

// Preprocess data /////////////////////////////////////////////////////////////////

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

// Utility /////////////////////////////////////////////////////////////////

function startAndEndToRange([start, end]) {
  return Array(end - start + 1)
    .fill(start)
    .map((value, i) => value + i);
}
