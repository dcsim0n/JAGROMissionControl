'use strict';
module.exports = (sequelize, DataTypes) => {
  const interval = sequelize.define('interval', {
    relayNum: DataTypes.INTEGER,
    frequency: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    stopTime: DataTypes.DATE
  }, {});
  interval.associate = function(models) {
    // associations can be defined here
  };
  return interval;
};