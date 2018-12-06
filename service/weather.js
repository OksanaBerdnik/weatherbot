const request = require('request');
const dateFormater = require('./dateFormater');

module.exports = (req, res ) => {
  const data = req.body.result;

  if (data.action === 'weather') {
    let city = data.parameters['geo-city'];

    if (data.parameters['date']) {
      var date = new Date(data.parameters['date']).getTime() / 1000;
    }

    if(data.parameters['date-period']) {
      var datePeriod = data.parameters['date-period'].split('/'),
        startPeriod = new Date(datePeriod[0]).getTime() / 1000,
        endPeriod = new Date(datePeriod[1]).getTime() / 1000;

      var period = Math.floor(Math.abs(endPeriod - startPeriod) / (60*60*24)) + 1;
    }

    let coordUrl = `${process.env.OPEN_WEATHER_MAP_API}&q=${city}`;

    request.get(coordUrl, (err, resp, body) => {
      if(err) {
        console.log(err);
        return res.status(400).json({
          status: {
            code: 400,
            errorType: 'I failed to look up the city name.'
          }
        });
      } else {

        const json = JSON.parse(body);
        const lon = json.coord.lon;
        const lat = json.coord.lat;
        const weatherAPI = `${process.env.DARK_SKY_API}/${lat},${lon}${date && !period ? (',' + date) : ''}${process.env.DARK_SKY_API_EXCLUDE}`;

        request.get(weatherAPI, (err, resp, body) => {
          if(err) {
            console.log(err);
            res.status(400).json({
              status: {
                code: 400,
                errorType: 'I failed to look up the city name.'
              }
            });
          } else {
            let msg = '';
            let json = JSON.parse(body);

            const dateFormat = dateFormater(json.currently.time);

            if (period) {
              let forecast = json.daily.summary;
              forecast = forecast.charAt(0).toLowerCase() + forecast.slice(1);

              msg = `Forecast for ${dateFormater(startPeriod)}-${dateFormater(endPeriod)}: in ${city} ${forecast}`;
            } else if(date) {
              msg = `For ${dateFormat} in ${city} ${json.currently.summary.toLowerCase()} and the temperature is ${json.currently.temperature}${decodeURI('%C2%B0')}F`;
            } else {
              msg = `For ${dateFormat} in ${city} ${json.currently.summary.toLowerCase()}, ${json.daily.data[1].summary.toLowerCase()} and the temperature is ${json.currently.temperature}${decodeURI('%C2%B0')}F`;
            }

            return res.status(200).json({
              speech: msg,
              displayText: msg,
              source: 'weather'
            });
          }
        });
      }
    });
  }
};
