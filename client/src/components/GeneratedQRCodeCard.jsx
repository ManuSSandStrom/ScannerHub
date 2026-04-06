import { Download } from 'lucide-react';
import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { downloadCanvas } from '../utils/download';

export default function GeneratedQRCodeCard({ content }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    downloadCanvas(canvasRef.current, 'qr-share-hub-code.png');
  };

  return (
    <div className="glass-card rounded-[32px] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">Re-generated QR</p>
          <h2 className="mt-3 text-2xl font-semibold text-[rgb(var(--text))]">Share the original payload again</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[rgb(var(--muted))]">
            This QR points to the extracted content itself, which is perfect for handoffs, print-outs, and quick re-use.
          </p>
          <button type="button" onClick={handleDownload} className="button-primary mt-5">
            <Download size={18} />
            Download PNG
          </button>
        </div>
        <div className="grid place-items-center rounded-[32px] bg-[rgba(var(--surface-strong),0.92)] p-5 shadow-card">
          <QRCodeCanvas
            ref={canvasRef}
            value={content}
            size={240}
            includeMargin
            bgColor="transparent"
            fgColor="rgb(15, 23, 42)"
            level="M"
          />
        </div>
      </div>
    </div>
  );
}
