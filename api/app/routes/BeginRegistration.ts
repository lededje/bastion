import express, { RequestHandler } from 'express'
import { body, ValidationError, validationResult } from 'express-validator';

import knex from '../services/knex';
import mail from '../services/mail';

import randomWords, { words } from '../utils/randomWords';

const app = express();

const welcomeEmail = (name: string, securityPhrase: string[]) => [
  `Hello ${name},`,
  '',
  'Complete sign up by clicking this link:',
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

export type ValidationErrorResponse = {
  error: 'REQUSET_BODY_VALIDATION_ERROR',
  message: 'The request contained invalid properties',
  context: ValidationError[],
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

  try {
    await knex('users')
      .insert({ name, email });
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
    text: welcomeEmail(name, securityPhrase)
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