import ValidationErrorResponse from '../types/RequestBodyValidationErrorResponse';
import request from 'supertest'
import knex from '../services/knex'

import app from './AvailableNumbers';

describe('AvailableNumbers GET /', () => {
  it('returns an error if country code is missing', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toContain<
          Pick<ValidationErrorResponse, 'error' | 'message'>
        >({
          error: 'REQUSET_BODY_VALIDATION_ERROR',
          message: 'The request contained invalid properties',
        })
        done();
      });
  });
});

afterAll(() => {
  knex.destroy()
})