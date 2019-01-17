const axios = require('axios');

module.exports = async (data) => {
  try {
    return await axios({
      url: process.env.FACEBOOK_SEND_API,
      params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
      method: 'POST',
      data
    });
  } catch (err) {
    // console.error(err);
  }
};
