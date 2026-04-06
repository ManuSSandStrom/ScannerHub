import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import GeneratedQRCodeCard from '../components/GeneratedQRCodeCard';
import PageHeader from '../components/PageHeader';
import ResultCard from '../components/ResultCard';
import { useAppContext } from '../context/AppContext';
import { saveQrData } from '../services/api';
import { copyText } from '../utils/download';
import { createShareUrl } from '../utils/qr';

export default function ResultPage() {
  const navigate = useNavigate();
  const { activeResult, registerShare } = useAppContext();
  const [showQr, setShowQr] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState(activeResult?.shareUrl || '');

  useEffect(() => {
    setShareUrl(activeResult?.shareUrl || '');
  }, [activeResult?.shareUrl]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const shareMessage = useMemo(
    () => `Take a look at this QR result from QR Share Hub: ${activeResult?.content || ''}`,
    [activeResult?.content]
  );

  if (!activeResult) {
    return (
      <ErrorState
        title="No active QR result"
        description="Scan a code or upload an image first, then we will bring the extracted payload back here for sharing and regeneration."
        actionLabel="Go home"
        onAction={() => navigate('/')}
      />
    );
  }

  const ensureShareUrl = async () => {
    if (shareUrl) {
      return shareUrl;
    }

    setShareLoading(true);
    setError('');

    try {
      const savedResult = await saveQrData({
        content: activeResult.content,
        type: activeResult.type,
      });
      const nextShareUrl = createShareUrl(window.location.origin, savedResult.id);
      registerShare({
        shareId: savedResult.id,
        shareUrl: nextShareUrl,
        result: activeResult,
      });
      setShareUrl(nextShareUrl);
      setNotice('Share link is ready.');
      return nextShareUrl;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(activeResult.content);
      setNotice('Copied the extracted content.');
    } catch {
      setError('Copy failed in this browser session.');
    }
  };

  const handleShare = async () => {
    const currentShareUrl = await ensureShareUrl();

    if (!currentShareUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QR Share Hub result',
          text: shareMessage,
          url: currentShareUrl,
        });
        setNotice('Native share sheet opened.');
        return;
      }

      await copyText(currentShareUrl);
      setNotice('Share link copied to clipboard.');
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        setError('Sharing was interrupted. You can still copy the link manually.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Result"
        title="Your QR payload is ready to use"
        description="Copy the content, save a shareable link, or re-generate the payload as a QR code for print and re-sharing."
      />
      <ResultCard
        result={activeResult}
        onCopy={handleCopy}
        onShare={handleShare}
        onToggleQr={() => setShowQr((currentValue) => !currentValue)}
        qrVisible={showQr}
        shareUrl={shareUrl}
        shareLoading={shareLoading}
        notice={notice}
        error={error}
      />
      {showQr ? <GeneratedQRCodeCard content={activeResult.content} /> : null}
    </div>
  );
}
