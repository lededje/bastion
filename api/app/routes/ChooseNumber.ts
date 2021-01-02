import PhoneNumber from '../types/PhoneNumber';
import express, { RequestHandler } from 'express'
import knex from '../services/knex';
import twilio from '../services/Twilio';
import Authenticated from '../middleware/Authenticated';

const app = express();

export type ChooseNumberRequestBody = {
  phoneNumber: string;
}

export const InvalidNumberErrorResponse = {
  error: 'INVALID_NUMBER',
  message: 'The number attempted to acquire is invalid. Please specify a valid phone number in E.164 format'
}

export const UnavailableNumberErrorResponse = {
  error: 'UNAVAILABLE_NUMBER',
  message: 'The number you tried to acquire is not available. Please choose another.'
}

export type ChooseNumberResponse = typeof InvalidNumberErrorResponse | PhoneNumber;

const ChooseNumber: RequestHandler<
  {}, ChooseNumberResponse, ChooseNumberRequestBody
> = async (req, res) => {

  let incomingPhoneNumber

  try {
    incomingPhoneNumber  = await twilio.incomingPhoneNumbers
    .create({ phoneNumber: req.body.phoneNumber })
  } catch (e) {
    switch(e.code) { 
      case 21421: { // Invalid: https://www.twilio.com/docs/api/errors/21421
        res.status(400).json(InvalidNumberErrorResponse);
        return;
      }
      case 21422: { // Unavailable:  https://www.twilio.com/docs/api/errors/21422
        res.status(400).json(UnavailableNumberErrorResponse);
        return;
      }
      default:
        throw e;
    }
  }

  const [ phoneNumber ] = await knex('phone_numbers')
    .insert({
      user_id: req.identity.id,
      phone_number: incomingPhoneNumber.phoneNumber,
    })
    .returning('*')
  
  res.json({
    id: phoneNumber.id,
    phoneNumber: phoneNumber.phone_number,
  });
}

app.use('/', Authenticated);

app.post('/', ChooseNumber);

export default app;