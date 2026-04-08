import { Home, ImagePlus, ScanLine } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import BrandMark from './BrandMark';
import InstallPrompt from './InstallPrompt';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/upload', label: 'Upload', icon: ImagePlus },
];

export default function AppShell({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute left-[-80px] top-0 h-64 w-64 rounded-full bg-[rgba(var(--primary),0.14)] blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-[rgba(var(--secondary),0.14)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-44 pt-4 sm:px-6 sm:pb-10 lg:px-8">
        <header className="glass-card mb-6 flex items-center justify-between rounded-[30px] px-4 py-3 sm:mb-8 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[rgb(var(--muted))]">QR Share Hub</p>
              <p className="text-sm font-semibold text-[rgb(var(--text))]">Scan, save, and share</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'text-[rgb(var(--muted))] hover:bg-[rgba(var(--surface-strong),0.92)]',
                  ].join(' ')
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          <ThemeToggle />
        </header>

        <main className="flex-1">{children}</main>
        <InstallPrompt />
        <MobileNav />
      </div>
    </div>
  );
}
