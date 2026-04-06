import { Clock3, ExternalLink, Trash2 } from 'lucide-react';
import { formatDate, truncateMiddle } from '../utils/qr';

export default function HistoryList({ history, onSelect, onClear }) {
  if (!history.length) {
    return (
      <div className="outline-card rounded-[28px] p-5 text-sm leading-6 text-[rgb(var(--muted))]">
        Your recent scans will show up here, including shared results and regenerated codes.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[rgb(var(--text))]">Recent history</p>
        <button type="button" onClick={onClear} className="inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <Trash2 size={16} />
          Clear
        </button>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <button
            type="button"
            key={item.shareId || `${item.type}:${item.content}`}
            onClick={() => onSelect(item)}
            className="glass-card flex w-full items-start gap-3 rounded-[28px] p-4 text-left transition hover:-translate-y-0.5"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(var(--secondary),0.14)] text-[rgb(var(--secondary))]">
              {item.type === 'url' ? <ExternalLink size={18} /> : <Clock3 size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{item.type}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted))]">{item.source}</span>
              </div>
              <p className="mt-3 break-words text-sm font-medium text-[rgb(var(--text))]">{truncateMiddle(item.content, 42, 22)}</p>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">{formatDate(item.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
