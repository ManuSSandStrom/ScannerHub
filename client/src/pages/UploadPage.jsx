import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import UploadDropzone from '../components/UploadDropzone';
import { useAppContext } from '../context/AppContext';

export default function UploadPage() {
  const navigate = useNavigate();
  const { setScanResult } = useAppContext();

  const handleDetected = (decodedText) => {
    setScanResult({ content: decodedText, source: 'upload' });
    navigate('/result');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Upload decode"
        title="Pull QR data from any image"
        description="Open your gallery, choose a screenshot or saved image with a QR code, and we will decode it with a clearer preview and friendlier validation."
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <UploadDropzone onDetected={handleDetected} />
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[rgb(var(--text))]">What works best</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[rgb(var(--muted))]">
            <p>High contrast images decode fastest.</p>
            <p>Crop extra background if the QR is tiny inside a screenshot.</p>
            <p>Blurry, over-compressed, or partially hidden codes may fail validation.</p>
            <p>If no QR is detected, try a different source image or a higher resolution export.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
