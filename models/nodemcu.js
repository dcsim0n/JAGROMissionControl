'use strict';
module.exports = (sequelize, DataTypes) => {
  const nodemcu = sequelize.define('nodemcu', {
    uniqueId: DataTypes.STRING,
    numOfRelays: DataTypes.INTEGER,
    numOfSensors: DataTypes.INTEGER
  }, {});
  nodemcu.associate = function(models) {
    nodemcu.hasMany(models.measurement);
    nodemcu.hasMany(models.relaystatus);
  };
  return nodemcu;
};