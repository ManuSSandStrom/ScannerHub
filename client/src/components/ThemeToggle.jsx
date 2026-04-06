import { MoonStar, SunMedium } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button-secondary h-11 w-11 rounded-2xl px-0"
      aria-label="Toggle color mode"
    >
      {theme === 'light' ? <MoonStar size={18} /> : <SunMedium size={18} />}
    </button>
  );
}
