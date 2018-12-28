const apiAiClient = require('apiai-promise')(process.env.API_AI_ACCESS_TOKEN);

exports.request_to_api = async (data) => {
  try {
    const { sender: { id: senderId }, message: { text: message } } = data;
    const res = await apiAiClient.textRequest(message, {
      sessionId: senderId
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};
