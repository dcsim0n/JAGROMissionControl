/*
* Blynk Unit Test
* Dana Simmons 2020
*
*/

const blynk = require('../lib/blynk');


describe('Blynk has a client', ()=> {
  test('Blynk has a start method', ()=> {
    expect(blynk.start).toBeDefined()
  });
});

describe('Blynk.start returns internal objects', ()=>{
  test('Start returns an object', ()=>{
    const guts = blynk.start();
    expect(guts).toHaveProperty('blynk');
  })
})

