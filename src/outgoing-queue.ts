import config from './config';

type callStatus = 'new' | 'calling' | 'failed';

interface CallInfo {
  fromNumber: string;
  toNumbers: {
    number: string;
    status: callStatus;
  }[];
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

export function markFailed(sid: string, toNumber: string) {
  const toNumberObj = store[sid].toNumbers.find(
    ({ number }) => toNumber === number
  );
  toNumberObj.status = 'failed';
}

export function getNext(sid: string): string {
  return store[sid].toNumbers.find(({ status }) => status === 'new').number;
}
