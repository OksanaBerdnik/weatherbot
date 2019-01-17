const { User } = require('../../models');

const createNewUser = async (id, city) => {
  try {
    const data = await User.create({
      fbId: id,
      defaultGeoCity: city
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

const updateUser = async (id, city) => {
  try {
    const data = await User.update(
      { defaultGeoCity: city },
      { where: { fbId: id } }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};


exports.updateOrCreateUser = async (id, city) => {
  try {
    const data = await User.findOne({ where: { fbId: id } });

    if (data) {
      await updateUser(id, city);
    } else {
      await createNewUser(id, city);
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
