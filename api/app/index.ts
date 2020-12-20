import express, { Request } from 'express'
import type { Response } from 'express-serve-static-core';
import knex from '../services/knex';

const app = express()

export type HealthResponse = {
  healthy: boolean;
  dbConnection: boolean;
}

app.get('/', async (req: Request, res: Response<HealthResponse, 200> ) => {
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
})

export default app;