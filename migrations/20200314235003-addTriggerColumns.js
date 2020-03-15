'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('triggers','active', { type: Sequelize.BOOLEAN }) 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('triggers', 'active')
  }
};
