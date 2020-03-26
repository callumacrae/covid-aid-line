import config from '../config';

type callStatus = 'new' | 'calling' | 'answered' | 'failed';

export interface ToNumber {
  number: string;
  status: callStatus;
  callOutSid?: string;
}

export interface CallInfo {
  fromNumber: string;
  toNumbers: ToNumber[];
}

const store: { [sid: string]: CallInfo } = {};

export function create(sid: string, fromNumber: string) {
  store[sid] = {
    fromNumber,
    toNumbers: config.numbers.map((number) => ({
      number,
      status: 'new',
    })),
  };
}

function get(sid: string, toNumber: string) {
  return store[sid].toNumbers.find(({ number }) => toNumber === number);
}

export function markFailed(sid: string, toNumber: string) {
  get(sid, toNumber).status = 'failed';
}

export function markAnswered(sid: string, toNumber: string) {
  get(sid, toNumber).status = 'answered';
}

export function getNext(sid: string): string | false {
  const toNumberObj = store[sid].toNumbers.find(
    ({ status }) => status === 'new'
  );
  if (!toNumberObj) {
    return false;
  }

  toNumberObj.status = 'calling';
  return toNumberObj.number;
}

export function setOutgoingSid(sid: string, toNumber: string, toSid: string) {
  get(sid, toNumber).callOutSid = toSid;
}

// @todo refactor this awful mess
export function getRinging(sid: string): ToNumber[] {
  return store[sid].toNumbers.filter(({ status }) => status === 'calling');
}

export function remove(sid: string) {
  delete store[sid];
}
