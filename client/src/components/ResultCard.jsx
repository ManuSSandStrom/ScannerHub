import { Copy, ExternalLink, Link2, QrCode } from 'lucide-react';
import { formatDate, truncateMiddle } from '../utils/qr';

export default function ResultCard({
  result,
  onCopy,
  onShare,
  onToggleQr,
  qrVisible,
  shareLabel = 'Share Link',
  shareUrl,
  shareLoading,
  notice,
  error,
}) {
  const isUrl = result.type === 'url';

  return (
    <div className="glass-card rounded-[32px] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge">{result.type}</span>
        <span className="badge">{result.source}</span>
        <span className="text-xs uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
          {formatDate(result.createdAt)}
        </span>
      </div>

      <div className="mt-6 rounded-[28px] border border-[rgba(var(--border),0.88)] bg-[rgba(var(--surface-strong),0.88)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">Extracted content</p>
        <p className="mt-4 break-words text-lg font-medium leading-8 text-[rgb(var(--text))]">{result.content}</p>
        {isUrl ? (
          <a
            href={result.content}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--secondary),0.12)] px-4 py-2 text-sm font-semibold text-[rgb(var(--secondary))]"
          >
            <ExternalLink size={16} />
            Open {truncateMiddle(result.content, 28, 12)}
          </a>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onCopy} className="button-secondary flex-1">
          <Copy size={18} />
          Copy
        </button>
        <button type="button" onClick={onShare} className="button-primary flex-1" disabled={shareLoading}>
          <Link2 size={18} />
          {shareLoading ? 'Preparing...' : shareLabel}
        </button>
        <button type="button" onClick={onToggleQr} className="button-secondary flex-1">
          <QrCode size={18} />
          {qrVisible ? 'Hide QR' : 'Generate QR'}
        </button>
      </div>

      {shareUrl ? (
        <div className="mt-5 rounded-[24px] border border-[rgba(var(--secondary),0.22)] bg-[rgba(var(--secondary),0.08)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--secondary))]">Shareable link</p>
          <div className="mt-3 break-all text-sm font-medium text-[rgb(var(--text))]">{shareUrl}</div>
        </div>
      ) : null}

      {notice ? <div className="status-success mt-5 rounded-2xl px-4 py-3 text-sm font-medium">{notice}</div> : null}
      {error ? <div className="status-danger mt-5 rounded-2xl px-4 py-3 text-sm font-medium">{error}</div> : null}
    </div>
  );
}
