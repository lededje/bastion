# Bastion

## Environment variables

Create a .env in api/

* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_REGION
* TWILIO_ACCOUNT_SID
* TWILIO_AUTH_TOKEN

## Login/Sign up flow

1. Ask user for their email with a generic next button.
2. Hit /authentication/create-session with that email
2a. If response is EMAIL_DOES_NOT_EXIST ask for their name and hit /onboarding/begin-registration
3. Send the request token in the email toward /authentication/validate-session
4. Profit.