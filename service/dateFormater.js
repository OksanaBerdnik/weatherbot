module.exports = (data) => {
  const date = new Date(data * 1000);
  const monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct',
    'Nov', 'Dec'
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();

  return day + monthNames[monthIndex];
};
