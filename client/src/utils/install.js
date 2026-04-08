function detectBrowserName({ userAgent, isIos, isSafari }) {
  if (isIos && isSafari) {
    return 'Safari';
  }

  if (/SamsungBrowser/i.test(userAgent)) {
    return 'Samsung Internet';
  }

  if (/EdgA|EdgiOS|Edg/i.test(userAgent)) {
    return 'Edge';
  }

  if (/OPR|OPiOS/i.test(userAgent)) {
    return 'Opera';
  }

  if (/Firefox|FxiOS/i.test(userAgent)) {
    return 'Firefox';
  }

  if (/CriOS|Chrome/i.test(userAgent)) {
    return 'Chrome';
  }

  return 'your browser';
}

export function getInstallContext() {
  if (typeof window === 'undefined') {
    return {
      browserName: 'your browser',
      isAndroid: false,
      isIos: false,
      isMobile: false,
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
    browserName: detectBrowserName({ userAgent, isIos, isSafari }),
    isAndroid,
    isIos,
    isMobile: isIos || isAndroid,
    isSafari,
    isStandalone,
  };
}

export function getInstallContent({ installContext, canAutoInstall }) {
  if (canAutoInstall) {
    return {
      description: 'Add QR Share Hub to your phone for a full-screen launch, faster reopen, and app-like access from your home screen.',
      note: 'If the browser asks for confirmation, approve it and the app will be added to your device.',
      steps: [
        'Tap Install below.',
        'Approve the browser confirmation if it appears.',
        'Open QR Share Hub from your home screen or app drawer.',
      ],
      title: 'Install QR Share Hub',
    };
  }

  if (installContext.isIos) {
    if (installContext.isSafari) {
      return {
        description: 'On iPhone and iPad, Safari can save this site to your home screen so it opens like an app.',
        note: 'Apple does not install PWAs like App Store apps. The supported path is Safari, then Add to Home Screen.',
        steps: [
          'Tap the Share button in Safari.',
          'Choose Add to Home Screen.',
          'Open QR Share Hub from your home screen.',
        ],
        title: 'Install On iPhone',
      };
    }

    return {
      description: `${installContext.browserName} on iPhone cannot install web apps directly. Open this page in Safari first.`,
      note: 'Apple only allows home-screen installation from Safari on iPhone and iPad.',
      steps: [
        'Open this page in Safari.',
        'Tap the Share button.',
        'Choose Add to Home Screen.',
      ],
      title: 'Open In Safari To Install',
    };
  }

  if (installContext.isAndroid) {
    return {
      description: `${installContext.browserName} on Android usually installs this app from the browser menu, even if no popup appears automatically.`,
      note: 'Some Android browsers wait until the site has a little engagement before showing the automatic install prompt.',
      steps: [
        'Open the browser menu.',
        'Tap Install app or Add to Home screen.',
        'Open QR Share Hub from your home screen or app drawer.',
      ],
      title: 'Install On Android',
    };
  }

  return {
    description: 'Your device can still save this site for quick access from the browser install or add-to-home-screen menu.',
    note: null,
    steps: ['Open the browser menu.', 'Choose Install app or Add to Home screen.'],
    title: 'Install QR Share Hub',
  };
}
