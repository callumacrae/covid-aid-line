import * as express from 'express';
import twilio from 'twilio';

import * as outgoingQueue from '../src/outgoing-queue';
import callNext from '../src/call-next';
import config from '../config';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function (req: express.Request, res: express.Response) {
  const sid = req.body.CallSid;
  const fromNumber = req.body.From;

  const response = new VoiceResponse();

  response.say('entering queue');
  response.enqueue(
    {
      action: 'http://callum.ngrok.io/incoming-call-action',
    },
    sid
  );

  outgoingQueue.create(sid, fromNumber);

  const callsInSeries = Math.min(config.callsInSeries, config.numbers.length);
  for (let i = 0; i < callsInSeries; i++) {
    callNext(sid);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(response.toString());
}
