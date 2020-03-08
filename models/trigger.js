

const TRIGGERS = {};
const TRIGGER_CHECK_INTERVAL = 5000;

function buildTrigger( trigger ){
  TRIGGERS[ trigger.id ] = setInterval(()=>{
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
    // Find all measurements with nodemcuID and sensorNum
    this.getNodemcu( mcu => {
      return mcu.getMeasurements({
        where: { sensorNum: this.sensorNum }
      })
    })
    .then( measurements => {
      console.log("Fetched number of measurements: ", measurements.length );
    })
    // from the last x minutes, where x is the smoothing window of
    // the trigger in minutes

  }

  trigger.initialize = function ( ){
    trigger.findAll({ include: nodemcu })
    .then( triggers => {
      // initialize each trigger into application memory
    })
  }
  return trigger;
}