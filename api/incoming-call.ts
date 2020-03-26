import * as express from 'express';
import twilio from 'twilio';

import * as outgoingQueue from '../src/outgoing-queue';
import callNext from '../src/call-next';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function (req: express.Request, res: express.Response) {
  const sid = req.body.CallSid;
  const fromNumber = req.body.From;

  const response = new VoiceResponse();

  response.say('entering queue');
  console.log('ENQUEUE', sid);
  response.enqueue(sid);

  outgoingQueue.create(sid, fromNumber);

  // todo: call more than one at a time
  callNext(sid);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(response.toString());
}
