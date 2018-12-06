const apiAiClient = require('apiai')(process.env.API_AI_ACCESS_TOKEN);

exports.request_to_api = (data, callback) => {
  const senderId = data.sender.id;
  const message = data.message.text;

  const apiAiSession = apiAiClient.textRequest(message, {
    sessionId: 'baked_wings'
  });

  apiAiSession.on('response', (res) => {
    res.senderId = senderId;
    console.error('efhbajwfghjafb');
    callback(res);
  });

  apiAiSession.on('error', (err) => {
    console.error(err);
  });

  apiAiSession.end();
};
