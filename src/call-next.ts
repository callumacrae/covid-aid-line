import twilio from 'twilio';

import config from '../src/config';
import * as outgoingQueue from '../src/outgoing-queue';

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

function callNext(sid: string) {
  const number = outgoingQueue.getNext(sid);

  client.calls
    .create({
      machineDetection: 'Enable',
      url: `http://callum.ngrok.io/outgoing-call/${sid}`,
      from: config.twilioNumber,
      to: number,
    })
    .then((call) => console.log(`Placing call to ${number}`))
    .catch((e) => console.error(e));
}

export default callNext;
