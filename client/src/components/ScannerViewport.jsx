import { Camera, CameraOff, RefreshCw } from 'lucide-react';
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

  if (/camera|video|notfound/i.test(message)) {
    return 'No usable camera was found. Try another device or switch to image upload.';
  }

  return 'We could not start your camera scanner. Check permissions, focus, and device support.';
};

const getPreferredCamera = (cameras = []) =>
  cameras.find((camera) => /back|rear|environment/i.test(camera.label)) || cameras[0] || null;

export default function ScannerViewport({ onDetected }) {
  const scannerId = useMemo(() => `qr-reader-${Math.random().toString(36).slice(2)}`, []);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [status, setStatus] = useState('booting');
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [cameraLabel, setCameraLabel] = useState('');

  const teardownScanner = useCallback(async () => {
    if (!scannerRef.current) {
      return;
    }

    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
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
    setCameraLabel('');
    hasScannedRef.current = false;
    await teardownScanner();

    const scanner = new Html5Qrcode(scannerId, { verbose: false });
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
      const cameras = await Html5Qrcode.getCameras();
      const preferredCamera = getPreferredCamera(cameras);

      if (!preferredCamera) {
        throw new Error('No camera devices available.');
      }

      setCameraLabel(preferredCamera.label || 'Selected camera');
      await scanner.start(preferredCamera.id, scanConfig, handleSuccess, () => {});
      setStatus('scanning');
      return;
    } catch (cameraLookupError) {
      try {
        await scanner.start({ facingMode: { ideal: 'environment' } }, scanConfig, handleSuccess, () => {});
        setCameraLabel('Back camera');
        setStatus('scanning');
        return;
      } catch (fallbackError) {
        setStatus('error');
        setError(getFriendlyError(fallbackError?.message || cameraLookupError?.message));
        await teardownScanner();
      }
    }
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
              Aim the code inside the frame and hold for a moment while we lock the first clean result.
            </p>
          </div>
          <span className="badge">{status}</span>
        </div>

        {cameraLabel ? (
          <div className="inline-flex max-w-fit items-center gap-2 rounded-full bg-[rgba(var(--secondary),0.1)] px-3 py-2 text-xs font-semibold text-[rgb(var(--secondary))]">
            <Camera size={14} />
            {cameraLabel}
          </div>
        ) : null}

        {error ? <div className="status-danger rounded-2xl px-4 py-3 text-sm font-medium">{error}</div> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="button-secondary flex-1 justify-start rounded-2xl px-4 py-3 text-sm">
            <CameraOff size={18} />
            Good lighting and a steady hand help decode faster.
          </div>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="button-secondary flex-1 rounded-2xl px-4 py-3 text-sm"
          >
            <RefreshCw size={18} />
            Restart scanner
          </button>
        </div>
      </div>
    </div>
  );
}
