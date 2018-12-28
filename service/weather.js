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
    let { daily: { summary: forecast } } = json;

    forecast = forecast.charAt(0).toLowerCase() + forecast.slice(1);

    return `Forecast for ${dateFormater(startPeriod)}-${dateFormater(endPeriod)}: in ${city} ${forecast}`;
  }
  const { currently: { temperature, summary } } = json;
  if (date) {
    return `For ${dateFormat} in ${city} ${summary.toLowerCase()} and the temperature is ${temperature}${decodeURI('%C2%B0')}F`;
  }
  return `For ${dateFormat} in ${city} ${summary.toLowerCase()}, ${json.daily.data[1].summary.toLowerCase()} and the temperature is ${temperature}${decodeURI('%C2%B0')}F`;
};

const getCityCoordinates = async (city) => {
  try {
    const coordUrl = `${process.env.OPEN_WEATHER_MAP_API}&q=${city}`;
    const res = await axios.get(coordUrl);
    const { data: { coord: { lat, lon } } } = res;
    return [lat, lon];
  } catch (err) {
    console.log(err);
  }
};

const requestToWeatherAPI = async (lat, lon, date, period) => {
  try {
    const weatherAPI = `${process.env.DARK_SKY_API}/${lat},${lon}${date && !period ? (`,${date}`) : ''}${process.env.DARK_SKY_API_EXCLUDE}`;
    const res = await axios.get(weatherAPI);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = async (req, defaultCity) => {
  const data = req.queryResult;

  try {
    const city = data.parameters['geo-city'] || defaultCity;
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

    const cityCoord = await getCityCoordinates(city);
    const weatherData = await requestToWeatherAPI(...cityCoord, date, period);
    const weatherMsg = await getWeatherMessage(city, date, startPeriod, endPeriod, period, weatherData);

    return weatherMsg;
  } catch (err) {
    console.log(err);
  }
};
