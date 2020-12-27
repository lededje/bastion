import express, { RequestHandler } from 'express'
import knex from '../services/knex';

const app = express();

export type HealthResponse = {
  healthy: boolean;
  dbConnection: boolean;
}

const Healthcheck: RequestHandler<{}, HealthResponse> = async (req, res) => {
  let dbConnection = false;

  try {
    await knex.raw('select 1 + 1 as result');
    dbConnection = true;
  } finally {
    res.json({
      healthy: true,
      dbConnection,
    });
  }
}

app.get('/', Healthcheck);

export default app;