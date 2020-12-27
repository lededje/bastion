import ValidationErrorResponse from '../types/RequestBodyValidationErrorResponse';
import express, { RequestHandler } from 'express'
import knex from '../services/knex';
import { body, validationResult } from 'express-validator';
import { User } from '../types/Tables';
import { sub, add } from 'date-fns';

const app = express();

export type ValidateSessionRequestBody = {
  requestToken: string;
}

export type RequestTokenExpiredErrorResponse = {
  error: 'REQUEST_TOKEN_EXPIRED',
  message: 'The request token is invalid, already been used or has expired, please request another'
}

export type ValidationSuccessResponse = {
  accessToken: string;
  name: User['name'];
  email: User['email'];
  createdAt: User['created_at'];
}

type ValidationSessionResponses =
  | ValidationErrorResponse
  | RequestTokenExpiredErrorResponse
  | ValidationSuccessResponse;

const ValidateSession: RequestHandler<{}, ValidationSessionResponses, ValidateSessionRequestBody> = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'REQUSET_BODY_VALIDATION_ERROR',
      message: 'The request contained invalid properties',
      context: errors.array(),
    });
    return;
  }

  const accessTokens = await knex('access_tokens')
    .where({ request_token: req.body.requestToken })
    .whereNull('access_token')
    .andWhere('created_at', '>=', sub(Date.now(), { minutes: 15 }))
    .update({ access_token: knex.raw('uuid_generate_v4()'), expires_at: add(Date.now(), { days: 30 }).toString() })
    .returning('*');
  
  if(accessTokens.length === 0) {
    res.status(400).json({
      error: 'REQUEST_TOKEN_EXPIRED',
      message: 'The request token is invalid, already been used or has expired, please request another'
    });
    return;
  }

  const accessToken = accessTokens[0];

  const user = await knex('users')
    .where({ id: accessToken.user_id })
    .first();

  if(user.verified === false) {
    await knex('users')
      .where({ id: accessToken.user_id })
      .update({ verified: true });
  }
  
  res.send({
    accessToken: accessTokens[0].access_token,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  })
}

app.post('/', [
  body('requestToken').isUUID(4),
], ValidateSession);

export default app;