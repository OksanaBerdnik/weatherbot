module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fbId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    defaultGeoCity: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = (models) => {
    User.belongsToMany(models.Entity, {
      through: 'UserEntity',
      as: 'entities',
      foreignKey: 'user_id'
    });
  };
  return User;
};
