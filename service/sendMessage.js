const axios = require('axios');

module.exports = (data) => {
  const [id, text] = [data.sender.id, data.message.text];

  axios({
    url: process.env.FACEBOOK_SEND_API,
    params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    data: {
      recipient: { id },
      message: { text }
    }
  })
    .then(() => console.log('Message sent'))
    .catch(err => console.error('Error sending message: ', err));
};
