import Twilio from 'twilio';

// Twilio mocks that use test credentials instead of production.
// This mock won't work for most calls because twilio apis are shite.
//
// https://www.twilio.com/docs/iam/test-credentials

const accountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
const authToken = process.env.TWILIO_TEST_AUTH_TOKEN;

const client = Twilio(accountSid, authToken);

export default client;