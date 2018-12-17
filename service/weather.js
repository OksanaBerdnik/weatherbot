const axios = require('axios');
const dateFormater = require('./dateFormater');

const getWeatherPeriodLimit = (period) => {
  const datePeriod = period.split('/');
  const startPeriod = new Date(datePeriod[0]).getTime() / 1000;
  const endPeriod = new Date(datePeriod[1]).getTime() / 1000;

  return [startPeriod, endPeriod];
};

const getWeatherPeriod = (start, end) => Math.floor(Math.abs(start - end) / (60 * 60 * 24)) + 1;

const getWeatherMessage = (city, date, startPeriod, endPeriod, period, json) => {
  const dateFormat = dateFormater(json.currently.time);

  if (period) {
    let forecast = json.daily.summary;
    forecast = forecast.charAt(0).toLowerCase() + forecast.slice(1);

    return `Forecast for ${dateFormater(startPeriod)}-${dateFormater(endPeriod)}: in ${city} ${forecast}`;
  }
  if (date) {
    return `For ${dateFormat} in ${city} ${json.currently.summary.toLowerCase()} and the temperature is ${json.currently.temperature}${decodeURI('%C2%B0')}F`;
  }
  return `For ${dateFormat} in ${city} ${json.currently.summary.toLowerCase()}, ${json.daily.data[1].summary.toLowerCase()} and the temperature is ${json.currently.temperature}${decodeURI('%C2%B0')}F`;
};

const getCityCoordinates = (city) => {
  return new Promise((resolve, reject) => {
    const coordUrl = `${process.env.OPEN_WEATHER_MAP_API}&q=${city}`;
    axios.get(coordUrl)
      .then((res) => {
        resolve([res.data.coord.lat, res.data.coord.lon]);
      })
      .catch(err => reject(err));
  });
};

const requestToWeatherAPI = (lat, lon, date, period) => {
  return new Promise((resolve, reject) => {
    const weatherAPI = `${process.env.DARK_SKY_API}/${lat},${lon}${date && !period ? (`,${date}`) : ''}${process.env.DARK_SKY_API_EXCLUDE}`;
    axios.get(weatherAPI)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

module.exports = (req, res) => {
  const data = req.body.result;

  // if (data.action === 'weather') {
  const city = data.parameters['geo-city'];
  let date;
  let period;
  let startPeriod;
  let endPeriod;

  if (data.parameters.date) {
    date = new Date(data.parameters.date).getTime() / 1000;
  }

  if (data.parameters['date-period']) {
    [startPeriod, endPeriod] = getWeatherPeriodLimit(data.parameters['date-period']);
    period = getWeatherPeriod(startPeriod, endPeriod);
  }
  getCityCoordinates(city)
    .then(result => requestToWeatherAPI(...result, date, period))
    .then(result => getWeatherMessage(city, date, startPeriod, endPeriod, period, result))
    .then((msg) => {
      res.status(200).json({
        speech: msg,
        displayText: msg,
        source: 'weather'
      });
    })
    .catch(err => console.log(err));
};
