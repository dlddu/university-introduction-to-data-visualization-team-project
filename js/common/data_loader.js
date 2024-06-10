import { ageIndex, ratingIndex, salaryIndex, yearIndex } from "./constant.js";

export const loadData = async () => {
  const years = ["2019", "2021", "2022", "2023"];
  let acc = [];
  for (const year of years) {
    const filepath = `/data/player_season_stats_${year}.csv`;
    const read = await d3.csv(filepath);
    acc = acc.concat(read);
  }

  return convertStringDataToFloat(acc);
};

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
