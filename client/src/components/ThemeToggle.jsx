import { MoonStar, SunMedium } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button-secondary h-8 w-8 rounded-xl px-0"
      aria-label="Toggle color mode"
    >
      {theme === 'light' ? <MoonStar size={14} /> : <SunMedium size={14} />}
    </button>
  );
}
