import type { RequestHandler } from 'express';
import knex from '../services/knex';
import isBefore from 'date-fns/isBefore';

type AuthotizationHeaderMissingErrorResponse = {
  error: 'AUTHORIZATION_HEADER_MISSING';
  message: 'Request is missing an authorization header'
}

type AccessTokenExpiredErrorResponse = {
  error: 'ACCESS_TOKEN_EXPIRED';
  message: 'Provided access token has expired, please request another'
}

type AccessTokenNotFoundErrorResponse = {
  error: 'ACCESS_TOKEN_NOT_FOUND';
  message: 'Provided access token has not been found, please request another'
}

type AccessTokenRevokedErrorResponse = {
  error: 'ACCESS_TOKEN_REVOKED';
  message: 'Provided access token has been revoked, please request another'
}

export type AuthenticatedResponses =
  | AuthotizationHeaderMissingErrorResponse
  | AccessTokenExpiredErrorResponse
  | AccessTokenNotFoundErrorResponse
  | AccessTokenRevokedErrorResponse;

const Authenticated: RequestHandler<{}, AuthenticatedResponses> = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if(accessToken === undefined) {
    res.status(400).json({
      error: 'AUTHORIZATION_HEADER_MISSING',
      message: 'Request is missing an authorization header',
    });
    return;
  }

  const token = await knex('access_tokens')
    .where({ access_token: accessToken })
    .first();

  if(token === undefined) {
    res.status(404).json({
      error: 'ACCESS_TOKEN_NOT_FOUND',
      message: 'Provided access token has not been found, please request another',
    });
    return;
  }
  
  if(token.expires_at === null || isBefore(new Date(token.expires_at), Date.now())) {
    res.status(400).json({
      error: 'ACCESS_TOKEN_EXPIRED',
      message: 'Provided access token has expired, please request another',
    });
    return;
  }

  if(token.revoked_at !== null && isBefore(new Date(token.revoked_at), Date.now())) {
    res.status(400).json({
      error: 'ACCESS_TOKEN_REVOKED',
      message: 'Provided access token has been revoked, please request another',
    });
    return;
  }

  next();
}

export default Authenticated;