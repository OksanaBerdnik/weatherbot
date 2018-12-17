const sendMessage = require('../service/sendMessage');
const aiService = require('../service/ai');

exports.post_all_messages = async (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(async (entry) => {
      entry.messaging.forEach(async (event) => {
        if (event.message && event.message.text) {
          try {
            const aiResponse = await aiService.request_to_api(event);
            const apiAiAnswer = {
              sender: {
                id: aiResponse.senderId
              },
              message: {
                text: aiResponse.result.fulfillment.speech
              }
            };
            sendMessage(apiAiAnswer);
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
    res.status(200).end();
  }
};
