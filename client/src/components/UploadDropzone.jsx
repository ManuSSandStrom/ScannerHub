import { ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useMemo, useRef, useState } from 'react';

export default function UploadDropzone({ onDetected }) {
  const scannerId = useMemo(() => `qr-upload-${Math.random().toString(36).slice(2)}`, []);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const decodeFile = async (file) => {
    if (!file) {
      setError('Choose an image file before trying to decode.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image uploads are supported for QR detection.');
      return;
    }

    setIsLoading(true);
    setError('');
    setFileName(file.name);

    const scanner = new Html5Qrcode(scannerId);

    try {
      const decodedText = await scanner.scanFile(file, true);
      onDetected(decodedText);
    } catch {
      setError('No valid QR code was detected in that file. Try a clearer image or different crop.');
    } finally {
      setIsLoading(false);
      try {
        await scanner.clear();
      } catch {
        // Clear can fail safely when scanFile exits early.
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    await decodeFile(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    await decodeFile(file);
  };

  return (
    <div className="glass-card rounded-[32px] p-5 sm:p-6">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <div id={scannerId} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          'flex min-h-[320px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed p-8 text-center transition',
          isDragging
            ? 'border-[rgb(var(--secondary))] bg-[rgba(var(--secondary),0.08)]'
            : 'border-[rgba(var(--border),0.82)] bg-[rgba(var(--surface-strong),0.74)]',
        ].join(' ')}
      >
        <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-slate-950 text-white shadow-card">
          {isLoading ? <LoaderCircle size={28} className="animate-spin" /> : <UploadCloud size={28} />}
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-[rgb(var(--text))]">
          {isLoading ? 'Scanning image...' : 'Drop an image or tap to upload'}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-[rgb(var(--muted))]">
          Screenshots, flyers, product labels, and event posters all work as long as the QR is visible.
        </p>
        <span className="button-primary mt-6">
          <ImagePlus size={18} />
          Choose image
        </span>
        {fileName ? <p className="mt-4 text-sm text-[rgb(var(--muted))]">Last file: {fileName}</p> : null}
      </button>
      {error ? <div className="status-danger mt-4 rounded-2xl px-4 py-3 text-sm font-medium">{error}</div> : null}
    </div>
  );
}
