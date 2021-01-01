import request from 'supertest'
import knex from '../services/knex'
import express from 'express';
import { formatISO } from 'date-fns'

import Authenticated, { AuthenticatedResponses } from './Authenticated';

const NOT_FOUND_ACCESS_TOKEN = 'bad0829b-e0ab-4822-befe-532add0037ec';
const EXPIRED_ACCESS_TOKEN = '47ebb1ce-e3ec-460c-a714-979b976e2c32';
const REVOKED_ACCESS_TOKEN = '81993891-cdee-4052-aa21-cfd3d7ee193c';
const GOOD_ACCESS_TOKEN = '5944e593-6952-4e0a-98f4-eb91ee2dfc1d';

const app = express();
app.use('/', Authenticated);

describe('Authenticated middleware', () => {
  beforeAll(() => {
    const FUTURE_DATE = formatISO(new Date('2100-01-01 12:00'));
    const PAST_DATE = formatISO(new Date('2000-01-01 12:00'));

    return knex('access_tokens')
      .insert([
        {
          user_id: 1,
          access_token: EXPIRED_ACCESS_TOKEN,
          expires_at: PAST_DATE,
        },
        {
          user_id: 1,
          access_token: REVOKED_ACCESS_TOKEN,
          expires_at: FUTURE_DATE,
          revoked_at: PAST_DATE,
        },
        {
          user_id: 1,
          access_token: GOOD_ACCESS_TOKEN,
          expires_at: FUTURE_DATE,
        },
      ])
  })

  afterAll(() => {
    return knex('access_tokens')
      .where('access_token', '=', EXPIRED_ACCESS_TOKEN)
      .orWhere('access_token', '=', REVOKED_ACCESS_TOKEN)
      .orWhere('access_token', '=', GOOD_ACCESS_TOKEN)
      .delete()
  })

  it('responds when header is missing', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<AuthenticatedResponses>({
          error: 'AUTHORIZATION_HEADER_MISSING',
          message: 'Request is missing an authorization header',
        })
        done();
      });
  });

  it('responds when token is not found', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .set('authorization', NOT_FOUND_ACCESS_TOKEN)
      .expect('Content-Type', /json/)
      .expect(404, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<AuthenticatedResponses>({
          error: 'ACCESS_TOKEN_NOT_FOUND',
          message: 'Provided access token has not been found, please request another',
        });
        done();
      });
  });
  it('responds when token is expired', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .set('authorization', EXPIRED_ACCESS_TOKEN)
      .expect('Content-Type', /json/)
      .expect(400, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<AuthenticatedResponses>({
          error: 'ACCESS_TOKEN_EXPIRED',
          message: 'Provided access token has expired, please request another',
        });
        done();
      });
  });
  it('responds when token is revoked', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .set('authorization', REVOKED_ACCESS_TOKEN)
      .expect('Content-Type', /json/)
      .expect(400, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual<AuthenticatedResponses>({
          error: 'ACCESS_TOKEN_REVOKED',
          message: 'Provided access token has been revoked, please request another',
        });
        done();
      });
  });
  it('responds when token is good', (done) => {
    const SUCCESS_BODY = { success: true };
    const app = express();
    app.use('/', Authenticated);
    app.get('/', (req, res) => res.json(SUCCESS_BODY));

    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .set('authorization', GOOD_ACCESS_TOKEN)
      .expect('Content-Type', /json/)
      .expect(200, (err, resp) => {
        if(err) done(err);
        expect(resp.body).toEqual(SUCCESS_BODY);
        done();
      });

  });
});

afterAll(() => {
  return knex.destroy()
})