import { MoonStar, SunMedium } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(var(--border),0.95)] bg-[rgba(var(--surface-strong),0.98)] px-0 text-[rgb(var(--text))] shadow-card transition hover:-translate-y-0.5 hover:border-[rgba(var(--secondary),0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--secondary),0.45)]"
      aria-label="Toggle color mode"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <MoonStar size={16} className="text-slate-900" strokeWidth={2.2} />
      ) : (
        <SunMedium size={16} className="text-amber-500" strokeWidth={2.2} />
      )}
    </button>
  );
}
