module.exports = {
  // up: (queryInterface, Sequelize) => {
  //   return queryInterface.changeColumn('Users',
  //     'defaultGeoCity', {
  //       type: Sequelize.STRING,
  //       allowNull: false,
  //       unique: true
  //     }
  //   );
  // },
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    fbId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    defaultGeoCity: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
