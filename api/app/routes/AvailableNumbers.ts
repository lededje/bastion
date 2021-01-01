import ValidationErrorResponse from '../types/RequestBodyValidationErrorResponse';
import express, { RequestHandler } from 'express'
import { param, validationResult } from 'express-validator';
import { MobileInstance } from 'twilio/lib/rest/api/v2010/account/availablePhoneNumber/mobile';
import twilio from '../services/twilio';
import authenticated from '../middleware/authenticated';

const app = express();

export type AvailableNumbersParams = {
  /** ISO 3166-1 alpha-2 - two-letter country codes */
  country: 'string'
}

export type AvailableNumbersResponse = {
  friendlyName: MobileInstance['friendlyName'];
  phoneNumber: MobileInstance['phoneNumber']
}[];

export type AvailableNumbersResponses =
  | ValidationErrorResponse
  | AvailableNumbersResponse

const AvailableNumbers: RequestHandler<AvailableNumbersParams, AvailableNumbersResponses> = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() === false) {
    res.status(400).json({
      error: 'REQUSET_BODY_VALIDATION_ERROR',
      message: 'The request contained invalid properties',
      context: errors.array(),
    });
    return;
  }

  const twilioFriendlyCountry = req.params.country.toUpperCase();

  const response = await twilio.availablePhoneNumbers(twilioFriendlyCountry)
    .mobile
    .list({ limit: 10, smsEnabled: true });

  const phoneNumbers = response.map(phoneNumber => ({
    friendlyName: phoneNumber.friendlyName,
    phoneNumber: phoneNumber.phoneNumber,
  }))

  res.json(phoneNumbers);
}

app.use(authenticated)

app.get('/:country',
  [
    param('country').isISO31661Alpha2(),
  ],
  AvailableNumbers
);

export default app;