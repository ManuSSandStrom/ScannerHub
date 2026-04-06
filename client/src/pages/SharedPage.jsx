import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import GeneratedQRCodeCard from '../components/GeneratedQRCodeCard';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import ResultCard from '../components/ResultCard';
import { useAppContext } from '../context/AppContext';
import { fetchQrData } from '../services/api';
import { copyText } from '../utils/download';
import { createShareUrl } from '../utils/qr';

export default function SharedPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hydrateResult } = useAppContext();
  const [showQr, setShowQr] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const shareUrl = useMemo(() => createShareUrl(window.location.origin, id), [id]);

  useEffect(() => {
    let mounted = true;

    const loadSharedResult = async () => {
      setIsLoading(true);
      setError('');

      try {
        const sharedResult = await fetchQrData(id);
        const hydrated = hydrateResult({
          ...sharedResult,
          source: 'shared',
          shareId: sharedResult.id,
          shareUrl,
        });

        if (mounted) {
          setResult(hydrated);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadSharedResult();

    return () => {
      mounted = false;
    };
  }, [hydrateResult, id, shareUrl]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  if (isLoading) {
    return <LoadingScreen fullScreen label="Loading shared QR result" />;
  }

  if (error || !result) {
    return (
      <ErrorState
        title="This share link is unavailable"
        description={error || 'The shared result could not be loaded. The link may be expired, invalid, or the server is offline.'}
        actionLabel="Go home"
        onAction={() => navigate('/')}
      />
    );
  }

  const handleCopy = async () => {
    try {
      await copyText(result.content);
      setNotice('Copied the shared content.');
    } catch {
      setError('Copy failed in this browser session.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QR Share Hub link',
          text: 'Open this saved QR result.',
          url: shareUrl,
        });
        setNotice('Native share sheet opened.');
        return;
      }

      await copyText(shareUrl);
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
        eyebrow="Shared result"
        title="This QR result was shared with you"
        description="The payload below is loaded from MongoDB, so anyone with this link can view the exact same result page."
      />
      <ResultCard
        result={result}
        onCopy={handleCopy}
        onShare={handleShare}
        onToggleQr={() => setShowQr((currentValue) => !currentValue)}
        qrVisible={showQr}
        shareLabel="Share Again"
        shareUrl={shareUrl}
        shareLoading={false}
        notice={notice}
        error={error}
      />
      {showQr ? <GeneratedQRCodeCard content={result.content} /> : null}
    </div>
  );
}
