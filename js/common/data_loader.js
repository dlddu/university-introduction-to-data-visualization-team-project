import {
  ageIndex,
  ratingIndex,
  salaryIndex,
  yearIndex,
  yearToSeason,
  positionFlags,
  year,
  nameIndex,
  positionIndex,
  nationIndex,
} from "./constant.js";

const loadedData = preLoadData("");
const loadedDefenseData = preLoadData("_defense");
const loadedPassingData = preLoadData("_passing");
const loadedShootingData = preLoadData("_shooting");

export const loadData = async () => {
  return (await loadedData)
    .filter((row) => row[yearIndex] == yearToSeason[year.value])
    .filter((row) => positionFlags[row[positionIndex]]);
};

export const loadStandardData = async (name, nation) => {
  return (await loadedData)
    .filter((row) => row[nameIndex] == name)
    .filter((row) => row[nationIndex] == nation);
};

export const loadDefenseData = async (name, nation) => {
  return (await loadedDefenseData)
    .filter((row) => row[nameIndex] == name)
    .filter((row) => row[nationIndex] == nation);
};

export const loadPassingData = async (name, nation) => {
  return (await loadedPassingData)
    .filter((row) => row[nameIndex] == name)
    .filter((row) => row[nationIndex] == nation);
};

export const loadShootingData = async (name, nation) => {
  return (await loadedShootingData)
    .filter((row) => row[nameIndex] == name)
    .filter((row) => row[nationIndex] == nation);
};

export const loadAllData = async () => {
  return (await loadedData).filter(
    (row) => row[yearIndex] == yearToSeason[year.value]
  );
};

async function preLoadData(field) {
  const years = ["2019", "2021", "2022", "2023"];
  let acc = [];
  for (const year of years) {
    const filepath = `/data/player_season_stats${field}_${year}.csv`;
    const read = await d3.csv(filepath);
    acc = acc.concat(read);
  }

  return convertStringDataToFloat(acc);
}

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
