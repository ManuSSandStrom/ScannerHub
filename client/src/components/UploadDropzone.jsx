import { ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function UploadDropzone({ onDetected }) {
  const scannerId = useMemo(() => `qr-upload-${Math.random().toString(36).slice(2)}`, []);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updatePreview = (file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const decodeFile = async (file) => {
    if (!file) {
      setError('Choose an image from your gallery or files before trying to decode.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image uploads are supported for QR detection.');
      return;
    }

    setIsLoading(true);
    setError('');
    setFileName(file.name);
    updatePreview(file);

    const scanner = new Html5Qrcode(scannerId, { verbose: false });

    try {
      const decodedText = await scanner.scanFile(file, true);
      onDetected(decodedText);
    } catch {
      setError('No valid QR code was detected in that image. Try a clearer gallery image or crop closer to the code.');
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
    event.target.value = '';
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

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          'rounded-[28px] border border-dashed p-6 text-center transition',
          isDragging
            ? 'border-[rgb(var(--secondary))] bg-[rgba(var(--secondary),0.08)]'
            : 'border-[rgba(var(--border),0.82)] bg-[rgba(var(--surface-strong),0.74)]',
        ].join(' ')}
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-slate-950 text-white shadow-card">
              {isLoading ? <LoaderCircle size={28} className="animate-spin" /> : <UploadCloud size={28} />}
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[rgb(var(--text))]">
              {isLoading ? 'Scanning image...' : 'Upload from gallery'}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[rgb(var(--muted))]">
              Tap below to open your gallery or files, then we will decode the QR from the selected image.
            </p>
            <button type="button" onClick={() => inputRef.current?.click()} className="button-primary mt-6">
              <ImagePlus size={18} />
              Choose from gallery
            </button>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
              You can also drag and drop an image here on desktop.
            </p>
            {fileName ? <p className="mt-4 text-sm text-[rgb(var(--muted))]">Selected image: {fileName}</p> : null}
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[rgba(var(--border),0.82)] bg-[rgba(var(--surface-strong),0.92)]">
            {previewUrl ? (
              <img src={previewUrl} alt="Selected upload preview" className="h-[280px] w-full object-cover" />
            ) : (
              <div className="grid h-[280px] place-items-center p-6">
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-[rgba(var(--secondary),0.12)] text-[rgb(var(--secondary))]">
                    <ImagePlus size={24} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[rgb(var(--text))]">Gallery preview appears here</p>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                    Choose a screenshot, saved QR pass, flyer, or any image containing a visible QR code.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error ? <div className="status-danger mt-4 rounded-2xl px-4 py-3 text-sm font-medium">{error}</div> : null}
    </div>
  );
}
