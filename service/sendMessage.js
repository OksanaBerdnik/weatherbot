const request = require('request');

module.exports = (data) => {
  const senderId = data.sender.id;
  const text = data.message.text;

  request({
    url: process.env.FACEBOOK_SEND_API,
    qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: senderId},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
      console.error('Error sending message: ', error);
    } else if (response.body.error) {
      console.error('Error: ', response.body.error);
    }
  });
};
