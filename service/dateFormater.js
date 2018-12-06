module.exports = (data) => {
  let date = new Date(data * 1000);
  let monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'
  ];

  let day = date.getDate();
  let monthIndex = date.getMonth();

  return day + monthNames[monthIndex];
};
