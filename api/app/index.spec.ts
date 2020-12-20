import request from 'supertest'

import app, { HealthResponse } from './';

describe('GET /healthcheck', () => {
  it('responds with json', (done) => {
    request(app)
      .get('/healthcheck')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<HealthResponse>({
          healthy: true,
        })
        done();
      });
  });
});