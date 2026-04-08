import { Download, Share2, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getInstallContent, getInstallContext } from '../utils/install';

export default function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installContext, setInstallContext] = useState(() => getInstallContext());
  const [guideOpen, setGuideOpen] = useState(false);

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
      setGuideOpen(false);
      syncInstallContext();
    };

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

  const canAutoInstall = Boolean(installPromptEvent);
  const showIosInstructions = !canAutoInstall && installContext.isIos;
  const showAndroidInstructions = !canAutoInstall && installContext.isAndroid;
  const shouldShowOnDevice =
    !installContext.isStandalone && installContext.isMobile && (canAutoInstall || showIosInstructions || showAndroidInstructions);

  if (!shouldShowOnDevice) {
    return null;
  }

  const handleInstall = async () => {
    if (!installPromptEvent) {
      setGuideOpen(true);
      return;
    }

    installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    if (result.outcome !== 'accepted') {
      setGuideOpen(true);
    }
    setInstallPromptEvent(null);
  };

  const { description, note, steps, title } = getInstallContent({ installContext, canAutoInstall });
  const actionIcon = canAutoInstall ? Download : installContext.isIos ? Share2 : Smartphone;
  const ActionIcon = actionIcon;

  return (
    <>
      <div className="fixed inset-x-4 bottom-24 z-40 sm:hidden">
        <button type="button" onClick={handleInstall} className="button-primary w-full justify-center py-3 text-sm shadow-lift">
          <Download size={18} />
          Download App
        </button>
      </div>

      {guideOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 pb-4 pt-10 sm:hidden">
          <div className="glass-card w-full rounded-[32px] p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                <ActionIcon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(false)}
                    className="rounded-full p-2 text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--surface-strong),0.88)] hover:text-[rgb(var(--text))]"
                    aria-label="Close install guide"
                  >
                    <X size={16} />
                  </button>
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

                {note ? <p className="mt-4 text-xs leading-5 text-[rgb(var(--muted))]">{note}</p> : null}

                <div className="mt-4 flex flex-wrap gap-3">
                  {canAutoInstall ? (
                    <button type="button" onClick={handleInstall} className="button-primary px-4 py-2 text-sm">
                      Download App
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setGuideOpen(false)} className="button-secondary px-4 py-2 text-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
