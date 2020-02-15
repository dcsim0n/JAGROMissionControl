'use strict';
module.exports = (sequelize, DataTypes) => {
  const relaystatus = sequelize.define('relaystatus', {
    uniqueId: DataTypes.STRING,
    relayNum: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  relaystatus.associate = function(models) {
    // associations can be defined here
  };
  return relaystatus;
};