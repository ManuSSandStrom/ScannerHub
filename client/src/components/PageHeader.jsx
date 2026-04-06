export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6 sm:mb-8">
      <span className="badge">{eyebrow}</span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[rgb(var(--text))] sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">{description}</p>
    </div>
  );
}
