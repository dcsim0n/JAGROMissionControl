'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('relaystatuses','nodemcuId',{
      type: Sequelize.INTEGER,
    })
    .then(()=>{
      return queryInterface.addColumn('measurements','nodemcuId',{
          type: Sequelize.INTEGER,
        });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('relaystatuses','nodemcuId')
    .then(()=>{
      return queryInterface.deleteColumn('measurements','nodemcuId');
    })
  }
};
