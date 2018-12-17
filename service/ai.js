const apiAiClient = require('apiai-promise')(process.env.API_AI_ACCESS_TOKEN);

exports.request_to_api = async (data) => {
  const senderId = data.sender.id;
  const message = data.message.text;
  try {
    const res = await apiAiClient.textRequest(message, {
      sessionId: 'baked_wings'
    });
    res.senderId = senderId;
    return res;
  } catch (err) {
    console.log(err);
  }
};
