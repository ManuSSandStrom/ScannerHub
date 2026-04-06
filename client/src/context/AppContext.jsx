import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeResult } from '../utils/qr';
import { readLocalStorage, writeLocalStorage } from '../utils/storage';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  theme: 'qr-share-hub:theme',
  activeResult: 'qr-share-hub:active-result',
  history: 'qr-share-hub:history',
  stats: 'qr-share-hub:stats',
};

const getHistoryKey = (item) => item.shareId || `${item.type}:${item.content}`;

const upsertHistory = (history, item) => {
  const normalized = normalizeResult(item);

  if (!normalized) {
    return history;
  }

  return [normalized, ...history.filter((entry) => getHistoryKey(entry) !== getHistoryKey(normalized))].slice(0, 8);
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => readLocalStorage(STORAGE_KEYS.theme, 'light'));
  const [activeResult, setActiveResultState] = useState(() => readLocalStorage(STORAGE_KEYS.activeResult, null));
  const [history, setHistory] = useState(() => readLocalStorage(STORAGE_KEYS.history, []));
  const [stats, setStats] = useState(() => readLocalStorage(STORAGE_KEYS.stats, { scans: 0, shares: 0 }));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeLocalStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeLocalStorage(STORAGE_KEYS.activeResult, activeResult);
  }, [activeResult]);

  useEffect(() => {
    writeLocalStorage(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    writeLocalStorage(STORAGE_KEYS.stats, stats);
  }, [stats]);

  const setScanResult = (payload) => {
    const nextResult = normalizeResult(payload);

    if (!nextResult) {
      return null;
    }

    setActiveResultState(nextResult);
    setHistory((currentHistory) => upsertHistory(currentHistory, nextResult));
    setStats((currentStats) => ({ ...currentStats, scans: currentStats.scans + 1 }));
    return nextResult;
  };

  const hydrateResult = (payload) => {
    const nextResult = normalizeResult(payload);

    if (!nextResult) {
      return null;
    }

    setActiveResultState(nextResult);
    setHistory((currentHistory) => upsertHistory(currentHistory, nextResult));
    return nextResult;
  };

  const selectHistoryItem = (item) => {
    const nextResult = normalizeResult(item);
    setActiveResultState(nextResult);
    return nextResult;
  };

  const registerShare = ({ shareId, shareUrl, result }) => {
    const baseResult = normalizeResult(result || activeResult);

    if (!baseResult) {
      return null;
    }

    const nextResult = {
      ...baseResult,
      shareId,
      shareUrl,
    };

    setActiveResultState(nextResult);
    setHistory((currentHistory) => upsertHistory(currentHistory, nextResult));
    setStats((currentStats) => ({ ...currentStats, shares: currentStats.shares + 1 }));
    return nextResult;
  };

  const clearHistory = () => setHistory([]);
  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

  const value = useMemo(
    () => ({
      theme,
      activeResult,
      history,
      stats,
      setScanResult,
      hydrateResult,
      selectHistoryItem,
      registerShare,
      clearHistory,
      toggleTheme,
    }),
    [theme, activeResult, history, stats]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
