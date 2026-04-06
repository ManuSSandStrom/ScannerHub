export const getContentType = (content = '') => {
  try {
    const url = new URL(content);
    return ['http:', 'https:'].includes(url.protocol) ? 'url' : 'text';
  } catch {
    return 'text';
  }
};

export const normalizeResult = (payload) => {
  if (!payload) {
    return null;
  }

  const content = String(payload.content ?? payload.text ?? payload ?? '').trim();

  if (!content) {
    return null;
  }

  const type = payload.type || getContentType(content);
  const createdAt = payload.createdAt || new Date().toISOString();

  return {
    content,
    type,
    source: payload.source || 'scan',
    createdAt,
    shareId: payload.shareId || payload.id || null,
    shareUrl: payload.shareUrl || null,
  };
};

export const truncateMiddle = (value, start = 28, end = 18) => {
  if (!value || value.length <= start + end) {
    return value;
  }

  return `${value.slice(0, start)}...${value.slice(-end)}`;
};

export const formatDate = (value) => {
  if (!value) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const createShareUrl = (origin, shareId) => `${origin}/share/${shareId}`;
