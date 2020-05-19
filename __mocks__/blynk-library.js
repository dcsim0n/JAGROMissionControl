/*
| Mock module for Blynk Client
| Dana Simmons 2020
*/

const events = require('events');



class Blynk extends events.EventEmitter {

  connect(){
    console.log("Connecting...");
  }
  disconnect(){
    console.log("Disconnecting...");
  }
  VirtualPin(num){
    const pin = new event.EventEmitter()
    pin.write = jest.fn();
    return pin;
  }

}

module.exports = Blynk;
