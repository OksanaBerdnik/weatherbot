module.exports = (sequelize, DataTypes) => {
  const Entity = sequelize.define('Entity', {
    name: DataTypes.STRING
  }, {});
  Entity.associate = (models) => {
    Entity.belongsToMany(models.User, {
      through: 'UserEntity',
      as: 'users',
      foreignKey: 'entity_id'
    });
  };
  return Entity;
};
