jest.mock('../middleware/Authenticated');

import request from 'supertest'
import knex from '../services/knex'

import app from './AvailableNumbers';

describe('AvailableNumbers GET /', () => {
  it('returns an array of available phone numbers', (done) => {
    request(app)
      .get('/GB')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, (err, resp) => {
        if(err) done(err);
        // Expect an array of friendlyNames and phoneNumbers
        expect(resp.body).toEqual(expect.arrayContaining(
          [
            expect.objectContaining({
              friendlyName: expect.any(String),
              phoneNumber: expect.any(String),
            })
          ]
        ))
        done();
      });
  });
});

afterAll(() => {
  knex.destroy()
})