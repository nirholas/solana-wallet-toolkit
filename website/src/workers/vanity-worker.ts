import nacl from 'tweetnacl';
import bs58 from 'bs58';

interface WorkerRequest {
  prefix: string;
  suffix: string;
  ignoreCase: boolean;
}

interface ProgressMessage {
  type: 'progress';
  attempts: number;
  rate: number;
}

interface ResultMessage {
  type: 'result';
  address: string;
  secretKey: number[];
  attempts: number;
  duration: number;
}

export type WorkerMessage = ProgressMessage | ResultMessage;

const PROGRESS_INTERVAL = 2000;

function matches(address: string, prefix: string, suffix: string, ignoreCase: boolean): boolean {
  const addr = ignoreCase ? address.toLowerCase() : address;
  const p = ignoreCase ? prefix.toLowerCase() : prefix;
  const s = ignoreCase ? suffix.toLowerCase() : suffix;
  if (p && !addr.startsWith(p)) return false;
  if (s && !addr.endsWith(s)) return false;
  return true;
}

(self as unknown as Worker).onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { prefix, suffix, ignoreCase } = e.data;
  let attempts = 0;
  const startTime = performance.now();

  while (true) {
    attempts++;

    const seed = nacl.randomBytes(32);
    const keyPair = nacl.sign.keyPair.fromSeed(seed);
    // bs58 v6 accepts Uint8Array directly
    const address = bs58.encode(keyPair.publicKey);

    if (matches(address, prefix, suffix, ignoreCase)) {
      const duration = (performance.now() - startTime) / 1000;
      // Solana secret key = seed (32 bytes) + public key (32 bytes)
      const secretKey = new Uint8Array(64);
      secretKey.set(seed);
      secretKey.set(keyPair.publicKey, 32);

      const msg: ResultMessage = {
        type: 'result',
        address,
        secretKey: Array.from(secretKey),
        attempts,
        duration,
      };
      (self as unknown as Worker).postMessage(msg);
      return;
    }

    if (attempts % PROGRESS_INTERVAL === 0) {
      const elapsed = (performance.now() - startTime) / 1000;
      const msg: ProgressMessage = {
        type: 'progress',
        attempts,
        rate: elapsed > 0 ? Math.round(attempts / elapsed) : 0,
      };
      (self as unknown as Worker).postMessage(msg);
    }
  }
};
