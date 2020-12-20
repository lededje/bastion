import express, { Request } from 'express'
import type { Response } from 'express-serve-static-core';

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export type HealthResponse = {
  healthy: boolean;
}

app.get('/healthcheck', (req: Request, res: Response<HealthResponse, 200> ) => {
  const repsonse = res.json({
    healthy: true,
  })

  return res;
})

export default app;