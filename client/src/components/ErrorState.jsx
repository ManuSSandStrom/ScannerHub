import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass-card rounded-[32px] p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(var(--danger),0.12)] text-[rgb(var(--danger))]">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[rgb(var(--text))]">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
          </div>
        </div>
        {actionLabel && onAction ? (
          <button type="button" onClick={onAction} className="button-primary shrink-0">
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
