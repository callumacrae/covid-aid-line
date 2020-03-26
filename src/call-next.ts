import twilio from 'twilio';

import config from '../src/config';
import * as outgoingQueue from '../src/outgoing-queue';

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);
const VoiceResponse = twilio.twiml.VoiceResponse;

function callNext(sid: string) {
  const number = outgoingQueue.getNext(sid);

  if (!number) {
    if (!outgoingQueue.anyRinging(sid)) {
      // todo: send a text to everyone requesting a callback
      console.log('Call was ignored');

      const response = new VoiceResponse();
      response.say(
        'Sorry, nobody is available to answer your call at the moment. We will call you back as soon as possible.'
      );

      client.calls(sid).update({ twiml: response.toString() });
    }
    return;
  }

  client.calls
    .create({
      machineDetection: 'Enable',
      url: `http://callum.ngrok.io/outgoing-call/${sid}`,
      from: config.twilioNumber,
      to: number,
    })
    .then((call) => {
      outgoingQueue.setOutgoingSid(sid, number, call.sid);
      console.log(`Placing call to ${number}`);
    })
    .catch((e) => console.error(e));
}

export default callNext;
