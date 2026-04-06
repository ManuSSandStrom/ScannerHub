export default function LoadingScreen({ label = 'Loading', fullScreen = false }) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-3 rounded-[32px] border border-[rgba(var(--border),0.75)] bg-[rgba(var(--surface-strong),0.72)] p-8 text-center shadow-card',
        fullScreen ? 'min-h-[50vh]' : 'min-h-[240px]',
      ].join(' ')}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgba(var(--border),0.9)] border-t-[rgb(var(--primary))]" />
      <div>
        <p className="text-base font-semibold text-[rgb(var(--text))]">{label}</p>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">Hang tight, we are warming up the experience.</p>
      </div>
    </div>
  );
}
