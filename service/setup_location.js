const axios = require('axios');

const dbDefaultCity = require('../db/user/user_default_city');

exports.sendGetStarted = () => {
  return {
    text: 'Welcome to the Weather Bot! Could you please provide your default city? If you give it to me I won\'t ask about it in future!',
    quick_replies: [
      {
        content_type: 'location'
      }
    ]
  };
};

exports.initPersistanteMenu = async () => {
  await axios({
    url: process.env.FACEBOOK_MESSENGER_PROFILE,
    params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    data: {
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: [
            {
              title: 'Set default city',
              type: 'postback',
              payload: 'SET_DEFAULT_CITY_PAYLOAD'
            },
            {
              title: 'Show my default city',
              type: 'postback',
              payload: 'SHOW_DEFAULT_CITY_PAYLOAD'
            }
          ]
        }
      ]
    }
  }).then(res => console.log(res.data)).catch(err => console.log(err));
};

exports.setDefaultCity = async () => {
  return {
    text: 'Please choose your default city',
    quick_replies: [
      {
        content_type: 'location'
      }
    ]
  };
};

exports.showDefaultCity = async (recipientId) => {
  try {
    const userDefaultCity = await dbDefaultCity.getUserCity(recipientId);
    console.log(userDefaultCity);
    const message = userDefaultCity ? `Your default city is ${userDefaultCity}` : 'You haven\'t got default city yet! Do you want to set one?';

    if (userDefaultCity) return { text: message };
    return {
      text: message,
      quick_replies: [
        {
          content_type: 'location'
        }
      ]
    };
  } catch (err) {
    console.error(err);
  }
};

exports.getCityByCoords = async (lat, long) => {
  try {
    const getCityByCoord = `${process.env.GOOGLE_MAPS}&latlng=${lat},${long}`;

    const result = await axios.get(getCityByCoord);

    const { data: { results: [{ address_components: [{ long_name: city }] }] } } = result;

    return city;
  } catch (err) {
    console.error(err);
  }
};
