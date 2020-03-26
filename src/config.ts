import * as dotenv from 'dotenv';

dotenv.config();

export default {
  twilioNumber: '+44 1788 422117',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,

  numbers: ['+447446885707' /*, '+441789841599'*/],
};
