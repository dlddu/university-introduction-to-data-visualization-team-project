import {
  nameIndex,
  ageIndex,
  tooltipWidth,
  tooltipHeight,
  teamIndex,
  nationIndex,
} from "./common/constant.js";
import {
  loadStandardData,
  loadDefenseData,
  loadPassingData,
  loadShootingData,
} from "./common/data_loader.js";
import { drawRank } from "./tooltip/rank.js";

export const showTooltip = async (root, data) => {
  const name = data[nameIndex];
  const nation = data[nationIndex];

  const standardData = await loadStandardData(name, nation);
  const defenseData = await loadDefenseData(name, nation);
  const passingData = await loadPassingData(name, nation);
  const shootingData = await loadShootingData(name, nation);

  const ageScale = getAgeScale(standardData);

  drawAgeAxis(root.append("g"), ageScale, standardData);
  drawRank(
    root.append("g"),
    ageScale,
    standardData,
    defenseData,
    passingData,
    shootingData
  );

  drawAgeAxisTitle(root);
  drawRatingAxisTitle(root);
  drawPlayerName(root, name);
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

function drawPlayerName(root, name) {
  root
    .append("text")
    .text(name)
    .attr("text-anchor", "start")
    .attr("x", tooltipWidth / 2)
    .attr("y", -20);
}

// Axis /////////////////////////////////////////////////////////////////////

function drawAgeAxis(root, ageScale, data) {
  const ageAxis = root
    .attr("transform", `translate(0, ${tooltipHeight})`)
    .call(d3.axisBottom(ageScale));

  // Render teams under age label
  const ages = [...data.map((d) => d[ageIndex])];
  const teams = [...data.map((d) => d[teamIndex])];

  ageAxis.selectAll("text").each(function () {
    d3.select(this.parentNode)
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .text((age) => {
        const index = ages.findIndex((d) => d === age);
        return index != -1 ? teams[index] : "";
      });
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

// Utility /////////////////////////////////////////////////////////////////

function startAndEndToRange([start, end]) {
  return Array(end - start + 1)
    .fill(start)
    .map((value, i) => value + i);
}
