/*
| Mock module for Blynk Client
| Dana Simmons 2020
*/


const HANDLERS = {};

class Blynk {
  constructor(token){
    //console.log("Using token:", token)
    //this.activeUserId = 'me'; //must pass this as part of the even
  }
  
  on(eventName, handler){ 
    // Add handlers for new events
    HANDLERS[eventName] = jest.fn(handler);
  }
  sendMessage( ){
    //not needed right now
  }

  VirtualPin(num){
    
  }

}
Blynk.HANDLERS = HANDLERS;
Blynk.fire = jest.fn((eventName, event)=>{
  console.log("Fire event: ", eventName);
  console.log("Firing with: ", event);

  return HANDLERS[eventName](event);
});

module.exports = Blynk;
