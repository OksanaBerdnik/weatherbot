const sendMessage = require('../service/sendMessage');
const aiService = require('../service/ai');
const setupLocation = require('../service/setup_location');

const dbUserActions = require('../db/user/user_updating');

exports.post_all_messages = async (req, res) => {
  if (req.body.object !== 'page') {
    res.status(200).end();
  }

  req.body.entry.map(async (entry) => {
    entry.messaging.map(async (event) => {
      let data;
      const { sender: { id: senderId } } = event;

      if (event.message && event.message.attachments) {
        const attachment = event.message.attachments[0];
        if (event.message.attachments[0].type === 'location') {

          const { payload: { coordinates: { lat, long } } } = attachment;
          const city = await setupLocation.getCityByCoords(lat, long);

          dbUserActions.updateOrCreateUser(senderId, city);

          data = { text: 'Thanks! I\'ll save it for future. If you want to change your city just open menu and tap on \'Set default city\'' };
        }
      } else if (event.postback) {
        const { postback: { payload } } = event;
        switch (payload) {
          case 'GET_STARTED_PAYLOAD':
            data = setupLocation.sendGetStarted(senderId);
            setupLocation.initPersistanteMenu();
            break;
          case 'SET_DEFAULT_CITY_PAYLOAD':
            data = await setupLocation.setDefaultCity(senderId);
            break;
          case 'SHOW_DEFAULT_CITY_PAYLOAD':
            data = await setupLocation.showDefaultCity(senderId);
            break;
          default:
            res.status(200).end();
        }
      } else if (event.message && event.message.text) {
        const aiResponse = await aiService.request_to_api(event);
        const { result: { fulfillment: { speech: message } } } = aiResponse;

        data = { text: message };
      }

      const messageData = {
        recipient: {
          id: senderId
        },
        message: data
      };

      sendMessage(messageData)
        .then(() => res.status(200).end())
        .catch(err => console.error(err));
    });
  });
};
