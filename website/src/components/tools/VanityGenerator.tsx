'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { isValidBase58, formatNumber } from '@/lib/utils';
import { ResultField } from './GenerateWallet';
import { ExplorerLink } from './ExplorerLink';
import type { WorkerMessage } from '@/workers/vanity-worker';

const MAX_THREADS = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;

export function VanityGenerator() {
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [threadCount, setThreadCount] = useState(MAX_THREADS);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{
    address: string;
    secretKey: string;
  } | null>(null);

  const workersRef = useRef<Worker[]>([]);
  // Per-worker attempt counts for aggregated progress
  const attemptsRef = useRef<number[]>([]);
  const ratesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);

  const terminateAll = useCallback(() => {
    for (const w of workersRef.current) w.terminate();
    workersRef.current = [];
    attemptsRef.current = [];
    ratesRef.current = [];
  }, []);

  function validate(): string | null {
    if (!prefix && !suffix) return 'Enter a prefix or suffix';
    if (prefix && !isValidBase58(prefix)) return 'Prefix contains invalid Base58 characters';
    if (suffix && !isValidBase58(suffix)) return 'Suffix contains invalid Base58 characters';
    return null;
  }

  function start() {
    if (running) return;
    const err = validate();
    if (err) { setStatus(err); return; }

    setRunning(true);
    setResult(null);
    setStatus(`Starting ${threadCount} thread${threadCount > 1 ? 's' : ''}...`);
    startTimeRef.current = performance.now();
    attemptsRef.current = new Array(threadCount).fill(0);
    ratesRef.current = new Array(threadCount).fill(0);

    const workers: Worker[] = [];

    for (let i = 0; i < threadCount; i++) {
      const idx = i;
      const worker = new Worker(
        new URL('../../workers/vanity-worker.ts', import.meta.url)
      );

      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const msg = e.data;

        if (msg.type === 'progress') {
          attemptsRef.current[idx] = msg.attempts;
          ratesRef.current[idx] = msg.rate;
          const totalAttempts = attemptsRef.current.reduce((a, b) => a + b, 0);
          const totalRate = ratesRef.current.reduce((a, b) => a + b, 0);
          const elapsed = (performance.now() - startTimeRef.current) / 1000;
          setStatus(
            `Mining on ${threadCount} thread${threadCount > 1 ? 's' : ''}... ${formatNumber(totalAttempts)} attempts (${elapsed.toFixed(1)}s, ~${formatNumber(totalRate)}/sec)`
          );
        }

        if (msg.type === 'result') {
          terminateAll();
          setRunning(false);
          const totalAttempts = attemptsRef.current.reduce((a, b) => a + b, 0) + msg.attempts;
          const elapsed = (performance.now() - startTimeRef.current) / 1000;
          const totalRate = Math.round(totalAttempts / elapsed);
          setStatus(
            `Found in ${formatNumber(totalAttempts)} attempts across ${threadCount} thread${threadCount > 1 ? 's' : ''} (${elapsed.toFixed(2)}s, ${formatNumber(totalRate)}/sec)`
          );
          setResult({
            address: msg.address,
            secretKey: JSON.stringify(msg.secretKey),
          });
        }
      };

      worker.onerror = (e) => {
        console.error('Worker error', e);
      };

      worker.postMessage({ prefix, suffix, ignoreCase });
      workers.push(worker);
    }

    workersRef.current = workers;
  }

  function stop() {
    terminateAll();
    setRunning(false);
    setStatus('Stopped');
  }

  function download() {
    if (!result) return;
    const blob = new Blob([result.secretKey], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.address}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clean up workers if component unmounts while running
  useEffect(() => () => terminateAll(), [terminateAll]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">
          Vanity Address Generator
        </h3>
        <p className="text-sm text-muted-foreground">
          Generate addresses with custom prefixes/suffixes. Solana addresses use
          Base58 encoding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">
            Prefix (start of address)
          </label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g., So1"
            maxLength={6}
            disabled={running}
            className="w-full px-3 py-2 bg-dark-800 border border-border rounded font-mono text-sm text-white placeholder:text-muted disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">
            Suffix (end of address)
          </label>
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="e.g., xyz"
            maxLength={6}
            disabled={running}
            className="w-full px-3 py-2 bg-dark-800 border border-border rounded font-mono text-sm text-white placeholder:text-muted disabled:opacity-50"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={ignoreCase}
          onChange={(e) => setIgnoreCase(e.target.checked)}
          disabled={running}
          className="accent-solana"
        />
        Case-insensitive matching
      </label>

      <div>
        <label className="flex items-center justify-between text-xs text-muted uppercase tracking-wide mb-2">
          <span>Threads</span>
          <span className="font-mono text-white normal-case tracking-normal">
            {threadCount} / {MAX_THREADS} logical CPUs
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={MAX_THREADS}
          value={threadCount}
          onChange={(e) => setThreadCount(Number(e.target.value))}
          disabled={running}
          className="w-full accent-solana disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>1</span>
          <span>{MAX_THREADS}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={start}
          disabled={running}
          className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? `Mining (${threadCount}t)...` : 'Start Mining'}
        </button>
        <button
          onClick={stop}
          disabled={!running}
          className="px-5 py-2.5 border border-border text-white font-semibold text-sm rounded hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>

      {status && (
        <p className={`text-sm ${status.startsWith('Found') ? 'text-solana-green' : 'text-muted-foreground'}`}>
          {status}
        </p>
      )}

      {result && (
        <div className="space-y-4 p-4 border border-border rounded-lg bg-dark-800/50 animate-fade-in">
          <ResultField label="Public Key (Address)" value={result.address} />
          <ExplorerLink address={result.address} />
          <ResultField label="Secret Key (JSON Array)" value={result.secretKey} />
          <button
            onClick={download}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-dark-700 transition-colors"
          >
            Download Keypair JSON
          </button>
        </div>
      )}
    </div>
  );
}
