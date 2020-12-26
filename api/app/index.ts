import express from 'express'

import Healthcheck from './routes/Healthcheck';
import BeginRegistration from './routes/BeginRegistration';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', Healthcheck);
app.use('/onboarding/begin-registration', BeginRegistration);

export default app;