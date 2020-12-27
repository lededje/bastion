import express, { RequestHandler } from 'express'
import { body, validationResult } from 'express-validator';
import { AccessToken, User } from '../types/Tables';

import knex from '../services/knex';
import mail from '../services/mail';

import ValidationErrorResponse from '../types/RequestBodyValidationErrorResponse';

import randomWords, { words } from '../utils/randomWords';

const app = express();

const newSessionEmail = (name: string, securityPhrase: string[], requestToken: string) => [
  'Verify your email to log on to Bastion',
  '',
  `Hello ${name},`,
  '',
  `We have received a login attempt with the following code: ${securityPhrase.join(', ')}`,
  '',
  'To complete the login process, please visit the link below:',
  '',
  `http://localhost:3000/api/authenticate/${requestToken}`,
  '',
  'If you did not sign sign in Bastion you can ignore this email.',
  '',
  'Best,',
  '',
  'Bastion Team',
].join('\n');

export type CreateSessionRequestBody = {
  email: string;
}

export type CreateSessionResponse = {
  securityPhrase: (typeof words[number])[];
}

export type EmailDoesNotExist = {
  error: 'EMAIL_DOES_NOT_EXIST',
  message: 'The email provided does not exist, sign up instead',
}

type BeginRegistrationResponses =
  | CreateSessionResponse
  | ValidationErrorResponse
  | EmailDoesNotExist;

const BeginRegistration:RequestHandler<{}, BeginRegistrationResponses, CreateSessionRequestBody> = async (
  req,
  res
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'REQUSET_BODY_VALIDATION_ERROR',
      message: 'The request contained invalid properties',
      context: errors.array(),
    });
    return;
  }

  const { email } = req.body;

  const securityPhrase = randomWords(4);

  let user: User, accessToken: AccessToken;

  try {
    user = await knex('users')
      .where({ email })
      .first();
    
    accessToken = await knex('access_tokens')
      .insert({ user_id: user.id }, '*')
      .first()

  } catch (e) {
    if(e.constraint === 'users_email_unique') {
      res.status(400).json({
        error: 'EMAIL_DOES_NOT_EXIST',
        message: 'The email provided does not exist, sign up instead',
      });
      return;
    }
    throw e
  }

  await mail.sendMail({
    from: 'Team Bastion <noreply@likeminded.io>',
    to: `${user.name} <${user.email}>`,
    subject: "Bastion Login Verification",
    text: newSessionEmail(user.name, securityPhrase, accessToken.request_token)
  });

  res.json({
    securityPhrase,
  });
}

app.post('/', [
  body('email').isEmail(),
  body('name').isLength({ min: 2 }),
], BeginRegistration);

export default app;