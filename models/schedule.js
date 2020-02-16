'use strict';
module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleStr: DataTypes.STRING,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  schedule.associate = function(models) {
    // associations can be defined here
  };
  return schedule;
};