const sendMessage = require('../service/sendMessage');
const aiService = require('../service/ai');

exports.post_all_messages = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {

          aiService.request_to_api(event, (data) => {

            const apiAiAnswer = {
              sender: {
                id: data.senderId
              },
              message: {
                text: data.result.fulfillment.speech
              }
            };

            sendMessage(apiAiAnswer);
          });
        }
      });
    });
    res.status(200).end();
  }
};
