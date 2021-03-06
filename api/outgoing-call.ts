import * as express from 'express';
import twilio from 'twilio';

import * as outgoingQueue from '../src/outgoing-queue';
import callNext from '../src/call-next';
import client from '../src/twilio-client';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function (req: express.Request, res: express.Response) {
  const sid = req.params.sid;
  const answeredBy = req.body.AnsweredBy;
  const toNumber = req.body.To;

  const response = new VoiceResponse();

  if (answeredBy === 'human') {
    response.say('Connecting');
    const dial = response.dial();
    dial.queue(sid);

    outgoingQueue.markAnswered(sid, toNumber);

    const ringing = outgoingQueue.getRinging(sid);

    ringing.forEach(({ callOutSid }) => {
      client.calls(callOutSid).update({ status: 'completed' });
    });
  } else {
    response.say(
      answeredBy === 'unknown'
        ? 'Unable to detect if human or answering machine, next time say "hi".'
        : 'Answering machine detected'
    );

    outgoingQueue.markFailed(sid, toNumber);
    callNext(sid);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(response.toString());
}
