'use strict';
module.exports = (sequelize, DataTypes) => {
  const measurement = sequelize.define('measurement', {
    uniqueId: DataTypes.STRING,
    sensorNum: DataTypes.INTEGER,
    value: DataTypes.FLOAT,
    time: DataTypes.DATE
  }, {});
  measurement.associate = function(models) {
    // associations can be defined here
  };
  return measurement;
};