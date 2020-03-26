import * as express from 'express';

import * as outgoingQueue from '../src/outgoing-queue';
import callNext from '../src/call-next';

export default function (req: express.Request, res: express.Response) {
  const sid = 'testtest';
  const fromNumber = '+447446885707';

  outgoingQueue.create(sid, fromNumber);

  callNext(sid);
  res.end('ok going');
}
