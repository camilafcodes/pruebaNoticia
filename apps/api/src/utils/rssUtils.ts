export const extractNewIdFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    if (url.includes('qhubocali.com')) {
      const match = url.match(/\?p=(\d+)/);
      if (match) return `qhubo-${match[1]}`;
    }
    
    if (url.includes('infobae.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `infobae-${parts[parts.length - 1]}`;
      }
    }
    
    if (url.includes('valoraanalitik.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `valora-${parts[parts.length - 1]}`;
      }
    }
    
    if (url.includes('futbolred.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `futbolred-${parts[parts.length - 1]}`;
      }
    }
    
    if (url.includes('elpais.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `elpais-${parts[parts.length - 1].replace('.html', '')}`;
      }
    }
    
    const lastPart = urlObj.pathname.split('/').filter(Boolean).pop() || 'unknown';
    return lastPart.replace(/\.html?$/, '');
  } catch (error) {
    console.error('Error extracting newId from URL:', url, error);
    return url.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 100);
  }
};

export const cleanHtmlContent = (content: string): string => {
  return content || '';
};

export const truncateDescription = (description: string, maxLength: number = 300): string => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
};
