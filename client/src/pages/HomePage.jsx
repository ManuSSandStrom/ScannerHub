import { ArrowRight, ShieldCheck, Share2, Sparkles, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HistoryList from '../components/HistoryList';
import StatPill from '../components/StatPill';
import { useAppContext } from '../context/AppContext';

const featureCards = [
  {
    title: 'Camera-first flow',
    description: 'Launch the scanner, detect in real time, and jump directly into a polished result screen.',
  },
  {
    title: 'Image upload decode',
    description: 'Pull QR data from screenshots, flyers, posters, and saved images with built-in validation.',
  },
  {
    title: 'Linkable share pages',
    description: 'Store a result in MongoDB, mint a share URL, and let anyone reopen the exact payload.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { history, stats, selectHistoryItem, clearHistory } = useAppContext();

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass-card overflow-hidden rounded-[36px] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="badge">Startup-grade QR workspace</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-[rgb(var(--text))] sm:text-5xl">
              Scan once. Share anywhere. Stay fast on mobile.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[rgb(var(--muted))] sm:text-lg">
              QR Share Hub keeps the whole flow tight: camera scan, image decode, clean result rendering, and a shareable page you can reopen later.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => navigate('/scan')} className="button-primary">
                <ScanLine size={18} />
                Scan QR
              </button>
              <button type="button" onClick={() => navigate('/upload')} className="button-secondary">
                <ArrowRight size={18} />
                Upload QR
              </button>
            </div>
          </div>

          <div className="app-gradient rounded-[32px] p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatPill icon={ScanLine} label="Scans" value={stats.scans} />
              <StatPill icon={Share2} label="Shares" value={stats.shares} />
            </div>
            <div className="mt-4 rounded-[28px] bg-slate-950 p-5 text-white shadow-lift">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/60">Built for devices</p>
                  <p className="mt-1 text-lg font-semibold">Installable PWA with offline shell</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Add the app to your home screen to make QR scanning feel like a native utility, not a clunky tab.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <article key={feature.title} className="glass-card rounded-[32px] p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(var(--surface-strong),0.88)] text-[rgb(var(--secondary))] shadow-card">
              <ShieldCheck size={20} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[rgb(var(--text))]">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted))]">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <HistoryList
            history={history}
            onSelect={(item) => {
              selectHistoryItem(item);
              navigate('/result');
            }}
            onClear={clearHistory}
          />
        </div>

        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <span className="badge">Flow</span>
          <h2 className="mt-4 text-2xl font-semibold text-[rgb(var(--text))]">A clean scan-to-share journey</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[rgb(var(--muted))]">
            <p>1. Scan live with your camera or decode a saved image.</p>
            <p>2. Review the extracted URL or text in a focused result card.</p>
            <p>3. Save the result to MongoDB and generate a shareable URL.</p>
            <p>4. Re-generate the original content as a fresh downloadable QR.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
