import express from 'express'

import Healthcheck from './routes/Healthcheck';
import BeginRegistration from './routes/BeginRegistration';
import CreateSession from './routes/CreateSession';
import ValidateSession from './routes/ValidateSession';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', Healthcheck);
app.use('/onboarding/begin-registration', BeginRegistration);
app.use('/authentication/create-session', CreateSession);
app.use('/authentication/validate-session', ValidateSession);

export default app;