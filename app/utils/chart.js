import moment from "moment";

export function generateVoteData(dataModel, vote) {
  const data = {};
  const dateGroup = dataModel.votes[vote].reduce(function(acc, date) {
    var startOfWeek = moment(date.createdAt, "YYYY-MM-DD")
      .startOf("week")
      .add(1, "days")
      .format("MM/DD/YY");
    data[startOfWeek] = data[startOfWeek] || [];
    data[startOfWeek].push(date.createdAt);
    return data;
  }, {});

  const arrayData = Object.keys(dateGroup);
  //const labels = [];
  const dataLabels = [];
  arrayData.forEach(e => {
    dataLabels.push({ y: dateGroup[e].length, x: e });
  });
  //const final = { dataLabels
  return dataLabels;
}
