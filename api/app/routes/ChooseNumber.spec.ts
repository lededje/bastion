jest.mock('../services/Twilio');

import request from 'supertest'
import knex from '../services/knex'

import app from '../index';
import { formatISO } from 'date-fns';
import { InvalidNumberErrorResponse, UnavailableNumberErrorResponse } from './ChooseNumber';

const AVAILABLE_NUMBER = '+15005550006';
const INVALID_NUMBER = '+15005550001';
const UNAVAILABLE_NUMBER = '+15005550000';

const USER = { name: 'Choose Number', email: 'choosenumber@example.com' };
const ACCESS_TOKEN = { access_token: 'eaf4caa8-7b3c-4540-a149-17116128e762', expires_at: formatISO(new Date('2100-01-01 12:00')) }

describe.skip('ChooseNumber POST /', () => {
  beforeAll(async () => {
    const [ user ] = await knex('users')
      .insert(USER)
      .returning('*')
    await knex('access_tokens')
      .insert({
        ...ACCESS_TOKEN,
        user_id: user.id
      })
  })

  afterAll(async () => {
    await knex('access_tokens')
      .where({
        access_token: ACCESS_TOKEN.access_token,
      })
      .delete();
    await knex('users')
      .where(USER)
      .delete();
  })

  it('allow registration of an available number', async () => {
    try {
      const response = await request(app)
        .post('/choose-number')
        .send({ phoneNumber: AVAILABLE_NUMBER })
        .set('Authorization', ACCESS_TOKEN.access_token)
        .set('Accept', 'application/json');
      
      expect(response.body).toEqual(expect.objectContaining({
        phoneNumber: AVAILABLE_NUMBER,
      }))
    } finally {
      await knex('phone_numbers')
        .where({ phone_number: AVAILABLE_NUMBER })
        .delete();
    }
  });

  it('errors when an invalid number number is requested', async () => {
    const response = await request(app)
      .post('/choose-number')
      .send({ phoneNumber: INVALID_NUMBER })
      .set('Authorization', ACCESS_TOKEN.access_token)
      .set('Accept', 'application/json');
    
    expect(response.body).toEqual(InvalidNumberErrorResponse)
  });

  it('errors when a phone number isn\'t available', async () => {
    const response = await request(app)
      .post('/choose-number')
      .send({ phoneNumber: UNAVAILABLE_NUMBER })
      .set('Authorization', ACCESS_TOKEN.access_token)
      .set('Accept', 'application/json');
    
    expect(response.body).toEqual(UnavailableNumberErrorResponse)
  })
});

afterAll(() => {
  knex.destroy()
})