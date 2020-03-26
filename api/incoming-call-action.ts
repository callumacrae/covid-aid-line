import * as express from 'express';

import * as outgoingQueue from '../src/outgoing-queue';
import client from '../src/twilio-client';

export default function (req: express.Request, res: express.Response) {
  const sid = req.body.CallSid;
  const status = req.body.QueueResult;

  if (status === 'hangup') {
    const ringing = outgoingQueue.getRinging(sid);

    ringing.forEach(({ callOutSid }) => {
      client.calls(callOutSid).update({ status: 'completed' });
    });

    outgoingQueue.remove(sid);
  }
}
