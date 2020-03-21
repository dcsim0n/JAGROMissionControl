'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('triggers', 'description',{ type: Sequelize.STRING })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('triggers', 'description');
  }
};
