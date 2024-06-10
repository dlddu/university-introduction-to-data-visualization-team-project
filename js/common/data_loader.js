import {
  ageIndex,
  ratingIndex,
  salaryIndex,
  yearIndex,
  yearToSeason,
  positionFlags,
  year,
} from "./constant.js";

const loadedData = preLoadData();

export const loadData = async () => {
  return (await loadedData)
    .filter((row) => row[yearIndex] == yearToSeason[year.value])
    .filter((row) => positionFlags[row["pos"]]);
};

export const loadAllData = async () => {
  return (await loadedData).filter(
    (row) => row[yearIndex] == yearToSeason[year.value]
  );
};

async function preLoadData() {
  const years = ["2019", "2021", "2022", "2023"];
  let acc = [];
  for (const year of years) {
    const filepath = `/data/player_season_stats_${year}.csv`;
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
