import twilio from 'twilio';

import config from '../src/config';
import * as outgoingQueue from '../src/outgoing-queue';

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

function callNext(sid: string) {
  const number = outgoingQueue.getNext(sid);

  if (!number) {
    console.log('Call was ignored');
    // todo: make this work
    client
      .calls(sid)
      .update({ twiml: '<Response><Say>Nope sorry</Say></Response>' });
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
      console.log('outgoing sid', call.sid);
      outgoingQueue.setOutgoingSid(sid, number, call.sid);
      console.log(`Placing call to ${number}`);
    })
    .catch((e) => console.error(e));
}

export default callNext;
