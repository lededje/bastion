jest.mock('../middleware/Authenticated');

import request from 'supertest'
import knex from '../services/knex'

import app from '../';

import { BeginRegistrationResponses } from './BeginRegistration'

describe('BeginRegistration POST /', () => {
  it('errors when info is missing', (done) => {
    request(app)
      .post('/onboarding/begin-registration')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, (err, resp) => {
        if(err) done(err);
        // Expect an array of friendlyNames and phoneNumbers
        expect(resp.body).toEqual<BeginRegistrationResponses>(expect.objectContaining({
          error: 'REQUSET_BODY_VALIDATION_ERROR',
          message: 'The request contained invalid properties',    
        }))
        done();
      });
  });

  it('errors when email is already in use', async () => {
    const USER = { email: 'alreadyinuse@example.com', name: 'Alread In-Use' }

    const [existingUser] = await knex('users')
      .insert(USER)
      .returning('*')

    try {
      const response = await request(app)
        .post('/onboarding/begin-registration')
        .send(USER)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
      
      expect(response.headers['content-type']).toEqual(expect.stringMatching(/json/));
      
      expect(response.body).toEqual<BeginRegistrationResponses>(({
        error: 'EMAIL_ALREADY_IN_USE',
        message: 'The email provided is already in use'
      }));

      expect(response.status).toEqual(400);
    } finally {
      await knex('users')
        .where({ id: existingUser.id })
        .delete();
    }
  });
});

afterAll(() => {
  knex.destroy()
})