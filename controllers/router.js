const { User } = require('../models');

const weatherService = require('../service/weather');

const createNewUser = async (req) => {
  try {
    const pos = req.session.indexOf('sessions/');
    const userId = req.session.slice(pos + 9);
    const data = await User.create({
      fbId: userId,
      defaultGeoCity: req.queryResult.parameters['geo-city']
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getUserCity = async (session) => {
  try {
    const pos = session.indexOf('sessions/');
    const userId = session.slice(pos + 9);

    let data = await User.findOne({ where: { fbId: userId } });
    if (data) {
      data = data.get({ plain: true });
      return data.defaultGeoCity;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
};

module.exports = async (req, res) => {
  const userDefaultCity = await getUserCity(req.body.session);

  if (req.body.queryResult.parameters['geo-city'] === '') {
    if (!userDefaultCity) {
      return res.status(200).end();
    }

    const weatherMsg = await weatherService(req.body, userDefaultCity);
    return res.status(200).json({
      fulfillmentText: weatherMsg,
      source: 'weather'
    });
  }

  if (req.body.queryResult.intent.displayName === 'defaultCity' && !userDefaultCity) {
    await createNewUser(req.body);
  }

  const weatherMsg = await weatherService(req.body);
  return res.status(200).json({
    fulfillmentText: weatherMsg,
    source: 'weather'
  });
};
