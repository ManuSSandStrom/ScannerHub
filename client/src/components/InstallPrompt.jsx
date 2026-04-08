import { Download, Share2, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getInstallContent, getInstallContext } from '../utils/install';

const DISMISS_KEY = 'qr-share-hub-install-dismissed-at';
const DISMISS_DURATION_MS = 1000 * 60 * 60 * 24 * 3;

export default function InstallPrompt({ dismissible = true, mobileOnly = true, variant = 'floating' }) {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installContext, setInstallContext] = useState(() => getInstallContext());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const syncInstallContext = () => {
      setInstallContext(getInstallContext());
    };

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
      syncInstallContext();
    };

    const onAppInstalled = () => {
      setInstallPromptEvent(null);
      setDismissed(false);
      window.localStorage.removeItem(DISMISS_KEY);
      syncInstallContext();
    };

    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY));
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION_MS) {
      setDismissed(true);
    } else {
      window.localStorage.removeItem(DISMISS_KEY);
    }

    const displayMode = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => syncInstallContext();

    syncInstallContext();
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    if (displayMode.addEventListener) {
      displayMode.addEventListener('change', onDisplayModeChange);
    } else {
      displayMode.addListener(onDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      if (displayMode.removeEventListener) {
        displayMode.removeEventListener('change', onDisplayModeChange);
      } else {
        displayMode.removeListener(onDisplayModeChange);
      }
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const handleInstall = async () => {
    if (!installPromptEvent) {
      return;
    }

    installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    if (result.outcome !== 'accepted') {
      handleDismiss();
    }
    setInstallPromptEvent(null);
  };

  const canAutoInstall = Boolean(installPromptEvent);
  const showIosInstructions = !canAutoInstall && installContext.isIos;
  const showAndroidInstructions = !canAutoInstall && installContext.isAndroid;
  const shouldShowOnDevice = canAutoInstall || showIosInstructions || showAndroidInstructions;

  if ((dismissible && dismissed) || installContext.isStandalone) {
    return null;
  }

  if (mobileOnly && !installContext.isMobile) {
    return null;
  }

  if (!shouldShowOnDevice) {
    return null;
  }

  const { description, note, steps, title } = getInstallContent({ installContext, canAutoInstall });
  const cardClassName =
    variant === 'inline'
      ? 'glass-card rounded-[32px] p-5 sm:p-6'
      : 'glass-card fixed inset-x-4 bottom-24 z-40 rounded-[28px] p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px]';

  return (
    <div className={cardClassName}>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
          {canAutoInstall ? <Download size={18} /> : installContext.isIos ? <Share2 size={18} /> : <Smartphone size={18} />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text))]">{title}</p>
              <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
            </div>
            {dismissible ? (
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-full p-2 text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--surface-strong),0.88)] hover:text-[rgb(var(--text))]"
                aria-label="Dismiss install prompt"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 text-sm text-[rgb(var(--muted))]">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--surface-strong),0.85)] text-xs font-semibold text-[rgb(var(--text))]">
                  {index + 1}
                </span>
                <span className="leading-6">{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {canAutoInstall ? (
              <button type="button" onClick={handleInstall} className="button-primary px-4 py-2 text-sm">
                Install
              </button>
            ) : null}
            {dismissible ? (
              <button type="button" onClick={handleDismiss} className="button-secondary px-4 py-2 text-sm">
                Maybe later
              </button>
            ) : null}
          </div>
          {note ? <p className="mt-3 text-xs leading-5 text-[rgb(var(--muted))]">{note}</p> : null}
        </div>
      </div>
    </div>
  );
}
