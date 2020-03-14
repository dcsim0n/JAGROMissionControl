'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('triggers',{
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },      
      sensorNum: { type: Sequelize.INTEGER , allowNull: false },
      nodemcuId: { type: Sequelize.INTEGER, allowNull: false },
      triggerValue: { type: Sequelize.FLOAT },
      smoothingWindow: { type: Sequelize.INTEGER },
      direction: { type: Sequelize.STRING },
      correction: { type: Sequelize.FLOAT },
      topic: { type: Sequelize.STRING },
      message: { type: Sequelize.STRING }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('triggers');
  }
};
