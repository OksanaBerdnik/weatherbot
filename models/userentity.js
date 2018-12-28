module.exports = (sequelize, DataTypes) => {
  const UserEntity = sequelize.define('UserEntity', {
    user_id: DataTypes.INTEGER,
    entity_id: DataTypes.INTEGER
  }, {});
  UserEntity.associate = () => {
    // associations can be defined here
  };
  return UserEntity;
};
