import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setInstallPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  if (!installPromptEvent || installed) {
    return null;
  }

  const handleInstall = async () => {
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  };

  return (
    <div className="glass-card fixed inset-x-4 bottom-24 z-40 rounded-[28px] p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white">
          <Download size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[rgb(var(--text))]">Install QR Share Hub</p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Save it to your phone for a native-feeling scanner and offline shell.
          </p>
        </div>
        <button type="button" onClick={handleInstall} className="button-primary px-4 py-2 text-sm">
          Install
        </button>
      </div>
    </div>
  );
}
