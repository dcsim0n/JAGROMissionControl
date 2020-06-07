'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex("measurements", {
      fields:["time"],
      using:"BTREE",
      name:"measurements_time_index"
    })
    .then(()=>{
      return queryInterface.addIndex("measurements", {
        fields:["id"],
        using:"BTREE",
        name:"measurements_id_index",
        unique:true
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex("measurements",["measurements_id_index","measurements_time_index"])
  }
};
