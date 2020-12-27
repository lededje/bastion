import express, { RequestHandler } from 'express'

const app = express();

const Onboarding: RequestHandler = async (req, res) => {
  // If the request gets here there are no steps.

  res.status(204).end();
}

app.get('/', Onboarding);

export default app;