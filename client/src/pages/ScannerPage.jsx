import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ScannerViewport from '../components/ScannerViewport';
import { useAppContext } from '../context/AppContext';

export default function ScannerPage() {
  const navigate = useNavigate();
  const { setScanResult } = useAppContext();

  const handleDetected = (decodedText) => {
    setScanResult({ content: decodedText, source: 'camera' });
    navigate('/result');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Live scanner"
        title="Use your camera for instant QR capture"
        description="We default to the rear camera on mobile and debounce the first good read so the flow feels smooth instead of chaotic."
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ScannerViewport onDetected={handleDetected} />
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[rgb(var(--text))]">Scanning tips</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[rgb(var(--muted))]">
            <p>Keep the QR centered inside the frame.</p>
            <p>Good ambient light improves decode speed dramatically.</p>
            <p>If the browser denies access, refresh and allow the camera permission.</p>
            <p>For development, `localhost` works. For deployed environments, use HTTPS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
