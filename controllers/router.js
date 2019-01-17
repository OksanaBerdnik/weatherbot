const weatherService = require('../service/weather');
const setupLocation = require('../service/setup_location');

const dbDefaultCity = require('../db/user/user_default_city');

module.exports = async (req, res) => {
  try {
    const pos = req.body.session.indexOf('sessions/');
    const userId = req.body.session.slice(pos + 9);

    if (req.body.queryResult.parameters['geo-city'] === '') {
      const userDefaultCity = await dbDefaultCity.getUserCity(userId);

      if (!userDefaultCity) {
        // console.log(req.body);
        // const data = await setupLocation.setDefaultCity(userId);

        return res.status(200).end();
      }

      const weatherMsg = await weatherService(req.body, userDefaultCity);
      return res.status(200).json({
        fulfillmentText: weatherMsg,
        source: 'weather'
      });
    }


    const weatherMsg = await weatherService(req.body);
    return res.status(200).json({
      fulfillmentText: weatherMsg,
      source: 'weather'
    });
  } catch (err) {
    console.error(err);
  }
};
