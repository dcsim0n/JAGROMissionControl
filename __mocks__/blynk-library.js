/*
| Mock module for Blynk Client
| Dana Simmons 2020
*/

const events = require('events');



// class Blynk extends events.EventEmitter {

//   connect(){
//     console.log("Connecting...");
//   }
//   disconnect(){
//     console.log("Disconnecting...");
//   }
//   VirtualPin(num){
//     const pin = new event.EventEmitter()
//     pin.write = jest.fn();
//     return pin;
//   }
// }

class VirtualPin extends events.EventEmitter {
    constructor(num){
      super();
      this.write = jest.fn();
    }
}

class Blynk extends events.EventEmitter {
  constructor(){
    super();
    this.connect = ()=>{}
    this.disconnect = ()=>{}
    this.VirtualPin = VirtualPin;
  }
}

class TcpClient{
  constructor(){
    console.log("Creating new TcpClient object...")
    this.connect = ()=>{console.log("Connecting...")}
  }
}
module.exports = { Blynk: Blynk , TcpClient: TcpClient };
