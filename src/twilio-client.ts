import twilio from 'twilio';
import config from '../config';

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);
export default client
