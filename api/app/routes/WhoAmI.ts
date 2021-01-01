import express, { RequestHandler } from 'express'
import knex from '../services/knex';
import Authenticated from '../middleware/Authenticated'

import IdentityType from '../types/Identity';

const app = express();

const Identity: RequestHandler<{}, IdentityType> = async (req, res) => {
  const user = await knex('users')
    .join('access_tokens', 'access_tokens.user_id', 'users.id')
    .select('id', 'name', 'email', 'verified')
    .where('access_token.access_token', '=', req.headers.authorization)
    .first();

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    verified: user.verified,
  })
}

app.use(Authenticated);

app.get('/', Identity);

export default app;