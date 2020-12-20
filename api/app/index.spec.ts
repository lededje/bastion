import request from 'supertest'
import knex from '../services/knex'

import app, { HealthResponse } from './';

describe('GET /', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<HealthResponse>({
          healthy: true,
          dbConnection: true,
        })
        done();
      });
  });
});

afterAll(() => {
  knex.destroy()
})