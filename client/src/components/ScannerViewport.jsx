import { CameraOff, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const scanConfig = {
  fps: 10,
  qrbox: { width: 240, height: 240 },
  aspectRatio: 1,
  disableFlip: false,
};

const getFriendlyError = (message = '') => {
  if (/permission|denied|notallowed/i.test(message)) {
    return 'Camera permission was denied. Please allow access and try again.';
  }

  if (/secure|https/i.test(message)) {
    return 'Camera scanning needs a secure context. Use HTTPS or localhost during development.';
  }

  return 'We could not start your camera scanner. Check permissions and device support.';
};

export default function ScannerViewport({ onDetected }) {
  const scannerId = useMemo(() => `qr-reader-${Math.random().toString(36).slice(2)}`, []);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [status, setStatus] = useState('booting');
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const teardownScanner = useCallback(async () => {
    if (!scannerRef.current) {
      return;
    }

    try {
      await scannerRef.current.stop();
    } catch {
      // The scanner may already be stopped.
    }

    try {
      await scannerRef.current.clear();
    } catch {
      // Clear can fail if stop never completed.
    }

    scannerRef.current = null;
  }, []);

  const startScanner = useCallback(async () => {
    setStatus('booting');
    setError('');
    hasScannedRef.current = false;
    await teardownScanner();

    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;

    const handleSuccess = async (decodedText) => {
      if (hasScannedRef.current) {
        return;
      }

      hasScannedRef.current = true;
      setStatus('success');
      onDetected(decodedText);
      await teardownScanner();
    };

    try {
      await scanner.start({ facingMode: { exact: 'environment' } }, scanConfig, handleSuccess);
    } catch (primaryError) {
      try {
        await scanner.start({ facingMode: 'environment' }, scanConfig, handleSuccess);
      } catch (fallbackError) {
        setStatus('error');
        setError(getFriendlyError(fallbackError?.message || primaryError?.message));
        await teardownScanner();
        return;
      }
    }

    setStatus('scanning');
  }, [onDetected, scannerId, teardownScanner]);

  useEffect(() => {
    startScanner();
    return () => {
      teardownScanner();
    };
  }, [retryKey, startScanner, teardownScanner]);

  return (
    <div className="glass-card rounded-[32px] p-5 sm:p-6">
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(var(--border),0.72)] bg-slate-950 p-3">
        <div className="scanner-shell min-h-[320px]" id={scannerId} />
        {!error ? (
          <>
            <div className="pointer-events-none absolute inset-9 rounded-[28px] border border-white/30" />
            <div className="scanner-shell__line pointer-events-none absolute inset-x-12 top-16 h-1 rounded-full" />
          </>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[24px] border border-[rgba(var(--border),0.72)] bg-[rgba(var(--surface-strong),0.8)] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[rgb(var(--text))]">{status === 'scanning' ? 'Scanner live' : 'Preparing camera'}</p>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Aim at a QR code and we will move you straight into the result flow.
            </p>
          </div>
          <span className="badge">{status}</span>
        </div>

        {error ? <div className="status-danger rounded-2xl px-4 py-3 text-sm font-medium">{error}</div> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="button-secondary flex-1 justify-start rounded-2xl px-4 py-3 text-sm">
            <CameraOff size={18} />
            Good lighting helps decode faster.
          </div>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="button-secondary flex-1 rounded-2xl px-4 py-3 text-sm"
          >
            <RefreshCw size={18} />
            Retry camera
          </button>
        </div>
      </div>
    </div>
  );
}
