

const { Op } = require('sequelize');

const TRIGGERS = {};
const TRIGGER_CHECK_INTERVAL = 5000;

function buildTrigger( trigger ){
  TRIGGERS[ trigger.id ] = setInterval(()=>{
    trigger.getNodemcu()
    .then( mcu => {
      mcu.getMeasurements( { where: { sensorNum: trigger.sensorNum } })
    })
    // collect all measurements that are inside of the smoothing / averaging window
    // calculate the average
    // if the average meets the trigger value 
    // ( greater than or less than based on direction )
    // send the appropriate command
  }, TRIGGER_CHECK_INTERVAL)
}

module.exports = (sequelize, DataTypes) => {
  const trigger = sequelize.define('trigger', {
    sensorNum: { type: DataTypes.INTEGER, allowNull: false },
    nodemcuId: { type: DataTypes.INTEGER, allowNull: false },
    triggerValue: DataTypes.FLOAT,
    smoothingWindow: DataTypes.INTEGER,
    direction: DataTypes.STRING,
    correction: DataTypes.FLOAT,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {});
 
  trigger.associate = function ( models ){
    trigger.belongsTo(models.nodemcu);
  }
  
  trigger.prototype.getWindowedValues = function(){
    // Build date objects that cover the smoothing window
    const startWindowTime = new Date();
    const endWindowTime = Object.assign( startWindowTime ); // Make copy of start time
    endWindowTime.setMinutes( startWindowTime.getMinutes() - this.smoothingWindow ) // Calculate the date object for x minutes ago
    
    // Find all measurements with nodemcuID and sensorNum
    return this.getNodemcu()
    .then( mcu => {
      if(this.smoothingWindow === 0 ){
        // If window = 0, just return the last measurement
        return mcu.getMeasurements({ 
          limit: 1, 
          where: { sensorNum: this.sensorNum }, 
          order: [['time', 'DESC']]}
        );
      }else{
        return mcu.getMeasurements({
          where: { [Op.and]: [
            { sensorNum: this.sensorNum },
            { time: {[Op.between]: [startWindowTime, endWindowTime]}}
          ]},
          order: [['time', 'DESC']]
        })
      }
    }) 
    .then( measurements => {
      console.log("Fetched number of measurements: ", measurements.length );
      return measurements; //return measurements wrapped in a Promise
    })

  }

  trigger.initialize = function ( ){
    trigger.findAll({ include: nodemcu })
    .then( triggers => {
      // initialize each trigger into application memory
    })
  }
  return trigger;
}