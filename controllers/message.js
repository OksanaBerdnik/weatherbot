const sendMessage = require('../service/sendMessage');
const aiService = require('../service/ai');

exports.post_all_messages = async (req, res) => {
  if (req.body.object !== 'page') {
    res.status(200).end();
  }

  req.body.entry.map(async (entry) => {
    entry.messaging.map(async (event) => {
      if (event.message && event.message.text) {
        try {
          const aiResponse = await aiService.request_to_api(event);
          const { sessionId: senderId } = aiResponse;

          const apiAiAnswer = {
            sender: {
              id: senderId
            },
            message: {
              text: aiResponse.result.fulfillment.speech
            }
          };

          sendMessage(apiAiAnswer)
            .then(() => {
              res.status(200).end();
            })
            .catch(err => console.error(err));
        } catch (err) {
          console.log('error');
        }
      }
    });
  });
};
