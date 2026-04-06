export default function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="outline-card rounded-3xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[rgb(var(--muted))]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(var(--surface-strong),0.9)] text-[rgb(var(--primary))] shadow-card">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
