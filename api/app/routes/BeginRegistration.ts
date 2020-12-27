import ValidationErrorResponse from '../types/RequestBodyValidationErrorResponse';
import express, { RequestHandler } from 'express'
import { body, validationResult } from 'express-validator';

import knex from '../services/knex';
import mail from '../services/mail';

import randomWords, { words } from '../utils/randomWords';
import { AccessToken, User } from '../types/Tables';

const app = express();

const welcomeEmail = (name: string, securityPhrase: string[], requestToken: string) => [
  `Hello ${name},`,
  '',
  `Complete sign up by clicking this link: http://localhost:3000/api/authenticate/${requestToken}`,
  '',
  `Security phrase: ${securityPhrase.join(', ')}`,
  '',
  'If you did not sign up to Bastion, please click this link:',
  '',
  'Best,',
  '',
  'Bastion Team',
].join('\n');

export type BeginRegistrationRequestBody = {
  name: string;
  email: string;
}

export type BeginRegistrationResponse = {
  securityPhrase: (typeof words[number])[];
}

export type EmailExistsErrorResponse = {
  error: 'EMAIL_ALREADY_IN_USE',
  message: 'The email provided is already in use',
}

type BeginRegistrationResponses =
  | BeginRegistrationResponse
  | ValidationErrorResponse
  | EmailExistsErrorResponse;

const BeginRegistration:RequestHandler<{}, BeginRegistrationResponses, BeginRegistrationRequestBody> = async (
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

  const { email, name } = req.body;

  const securityPhrase = randomWords(4);

  let user: User, accessToken: AccessToken;

  try {
    const [newUser] = await knex('users')
      .insert({ name, email }, '*')

    user = newUser;

    const [newAccessToken] = await knex('access_tokens')
      .insert({ user_id: user.id }, '*')

    accessToken = newAccessToken;

  } catch (e) {
    if(e.constraint === 'users_email_unique') {
      res.status(400).json({
        error: 'EMAIL_ALREADY_IN_USE',
        message: 'The email provided is already in use',
      });
      return;
    }
    throw e
  }

  await mail.sendMail({
    from: 'Team Bastion <noreply@likeminded.io>',
    to: `${name} <${email}>`,
    subject: "Complete Bastion Registration",
    text: welcomeEmail(name, securityPhrase, accessToken.request_token)
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
