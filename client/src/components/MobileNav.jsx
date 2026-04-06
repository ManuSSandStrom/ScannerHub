import { Home, ImagePlus, QrCode, ScanLine } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/upload', label: 'Upload', icon: ImagePlus },
  { to: '/result', label: 'Result', icon: QrCode },
];

export default function MobileNav() {
  return (
    <nav className="glass-card fixed inset-x-4 bottom-4 z-40 grid grid-cols-4 rounded-[28px] p-2 shadow-lift sm:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition',
              isActive
                ? 'bg-slate-950 text-white'
                : 'text-[rgb(var(--muted))] hover:bg-[rgba(var(--surface-strong),0.9)]',
            ].join(' ')
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
