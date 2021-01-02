import express, { RequestHandler } from 'express'
import knex from '../services/knex';

import Twilio from 'twilio';

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

interface TwilioWebHook {
  ToCountry: string;
  ToState: string;
  SmsMessageSid: string;
  NumMedia: string;
  ToCity: string;
  FromZip: string;
  SmsSid: string;
  FromState: string;
  SmsStatus: string;
  FromCity: string;
  Body: string;
  FromCountry: string;
  To: string;
  ToZip: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
}

const app = express();

const RecieveMessage: RequestHandler<
  {}, null, TwilioWebHook
> = async (req, res) => {

  const twilioSignature = req.headers['x-twilio-signature'] as string;

  if(twilioSignature === undefined) {
    throw new Error('RecieveMessage: endpoint expects a signature')
  }

  const isFromTwilio = Twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    twilioSignature,
    `/`, // This must match the incoming URL exactly, which contains a /
    req.body
  )

  if(isFromTwilio === false) {
    throw new Error('RecieveMessage: signature invalid')
  }

  await knex('messages')
    .insert({
      sid: req.body.SmsSid,
      to_phone_number_id: req.identity.id,
      from: req.body.From,
      body: req.body.Body,
      from_city: req.body.FromCity,
      from_zip: req.body.FromZip,
      from_country: req.body.FromCountry,
    })
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('<Response></Response>');
}

app.get('/', RecieveMessage);

export default app;