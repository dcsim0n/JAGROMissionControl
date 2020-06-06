'use strict';
module.exports = (sequelize, DataTypes) => {
  const measurement = sequelize.define('measurement', {
    uniqueId: DataTypes.STRING,
    sensorNum: DataTypes.INTEGER,
    value: DataTypes.FLOAT,
    time: DataTypes.DATE
  },
  {
    indexes: [
      { name: 'measurements_id_index', unique: true, fields: ['id'] },
      { name: 'measurements_time_index', fields: ['time'], using: 'BTREE'}
    ]
  });
  measurement.associate = function(models) {
    measurement.belongsTo(models.nodemcu);
  };
  return measurement;
};