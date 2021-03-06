import Authenticated from '../../middleware/Authenticated';
import express, { RequestHandler } from 'express'
import ChooseANumber from './ChooseANumber';

const app = express();

const Onboarding: RequestHandler = async (req, res) => {
  // If the request gets here there are no steps.

  res.status(204).end();
}

app.get('/', Authenticated, ChooseANumber, Onboarding);

export default app;