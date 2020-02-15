'use strict';
module.exports = (sequelize, DataTypes) => {
  const nodemcu = sequelize.define('nodemcu', {
    uniqueId: DataTypes.STRING,
    numOfRelays: DataTypes.INTEGER,
    numOfSensors: DataTypes.INTEGER
  }, {});
  nodemcu.associate = function(models) {
    // associations can be defined here
  };
  return nodemcu;
};