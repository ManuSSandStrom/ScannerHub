import { Download, Share2, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'qr-share-hub-install-dismissed-at';
const DISMISS_DURATION_MS = 1000 * 60 * 60 * 24 * 3;

function getInstallContext() {
  if (typeof window === 'undefined') {
    return {
      isAndroid: false,
      isIos: false,
      isSafari: false,
      isStandalone: false,
    };
  }

  const userAgent = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';
  const isTouchMac = platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  const isIos = /iPad|iPhone|iPod/i.test(userAgent) || isTouchMac;
  const isAndroid = /Android/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Android/i.test(userAgent);
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  return {
    isAndroid,
    isIos,
    isSafari,
    isStandalone,
  };
}

export default function InstallPrompt() {
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

  if (dismissed || installContext.isStandalone || (!canAutoInstall && !showIosInstructions && !showAndroidInstructions)) {
    return null;
  }

  const title = canAutoInstall ? 'Install QR Share Hub' : 'Install on your phone';
  const description = canAutoInstall
    ? 'Add the scanner to your device for a full-screen launch, faster reopen, and offline shell.'
    : installContext.isIos
      ? installContext.isSafari
        ? 'iPhone and iPad install through Safari using Add to Home Screen.'
        : 'iPhone install works through Safari. Open this page in Safari to add it to your home screen.'
      : 'If your browser does not show the install sheet automatically, use the browser menu to add the app manually.';

  const instructionSteps = canAutoInstall
    ? ['Tap Install to save QR Share Hub like an app on this device.']
    : installContext.isIos
      ? installContext.isSafari
        ? ['Tap the Share button in Safari.', 'Choose Add to Home Screen.', 'Launch QR Share Hub from your home screen.']
        : ['Open this page in Safari.', 'Tap the Share button.', 'Choose Add to Home Screen.']
      : ['Open the browser menu.', 'Tap Install app or Add to Home screen.', 'Launch QR Share Hub from your home screen or app drawer.'];

  return (
    <div className="glass-card fixed inset-x-4 bottom-24 z-40 rounded-[28px] p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px]">
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
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full p-2 text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--surface-strong),0.88)] hover:text-[rgb(var(--text))]"
              aria-label="Dismiss install prompt"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {instructionSteps.map((step, index) => (
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
            <button type="button" onClick={handleDismiss} className="button-secondary px-4 py-2 text-sm">
              Maybe later
            </button>
          </div>
          {!canAutoInstall && installContext.isIos && !installContext.isSafari ? (
            <p className="mt-3 text-xs leading-5 text-[rgb(var(--muted))]">
              Apple only allows home-screen installation from Safari, so Chrome and other iPhone browsers cannot show a direct install button.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
