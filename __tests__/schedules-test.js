/**
 * Scheules route Unit Test
 * Dana Simmons 2020
 */

const request = require('supertest');
const models = require('../models');
const app = require('../app');

beforeAll(()=>{
  return models.schedule.bulkCreate([
    {scheduleStr:"2 * * * *", topic: "testing0", message: "this is a test message", active: true},
    {scheduleStr:"3 * * * *", topic: "testing1", message: "this is test message 1", active: true},
    {scheduleStr:"4 * * * *", topic: "testing2", message: "this is test message 2", active: true},
    {scheduleStr:"5 * * * *", topic: "testing3", message: "this is test message 3", active: true},
  ]);
});

afterAll(()=>{
  return models.schedule.destroy({truncate: true});
});

describe('GET /schedules',() =>{
  test("Should return a list of schedules", ()=>{
    expect.assertions(1);
    return request(app)
    .get('/api/v1/schedules')
    .then((res)=>{
      return expect(res.body.length).toBe(4);
    })
  })
})