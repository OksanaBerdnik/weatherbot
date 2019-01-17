const { User } = require('../../models');

exports.getUserCity = async (id) => {
  try {
    let data = await User.findOne({ where: { fbId: id } });
    if (data) {
      data = data.get({ plain: true });
      return data.defaultGeoCity;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
};
