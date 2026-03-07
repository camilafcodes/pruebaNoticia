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
    
    if (url.includes('columnadigital.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `columna-${parts[parts.length - 1]}`;
      }
    }
    
    if (url.includes('eltiempo.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return `eltiempo-${parts[parts.length - 1]}`;
      }
    }
    
    if (url.includes('lasillavacia.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        return `lasillavacia-${lastPart.replace(/\/$/, '')}`;
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

export const removeFirstFigureTag = (content: string): string => {
  if (!content) return '';
  
  // Remover solo el primer <figure>...</figure> (case insensitive, multiline)
  const figureRegex = /<figure[^>]*>[\s\S]*?<\/figure>/i;
  return content.replace(figureRegex, '').trim();
};

export const removeFirstImageTag = (content: string): string => {
  if (!content) return '';
  
  // Remover el primer tag <img> completo (con o sin cierre)
  const imgRegex = /<img[^>]*\/?>/i;
  let cleaned = content.replace(imgRegex, '');
  
  // Remover también el tag de cierre </img> si existe inmediatamente después
  cleaned = cleaned.replace(/^\s*<\/img>\s*/i, '');
  
  return cleaned.trim();
};

export const cleanDescriptionFromHtml = (description: string): string => {
  if (!description) return '';
  
  // Remover tags de imagen completos
  let cleaned = description.replace(/<img[^>]*>/gi, '');
  
  // Remover otros tags HTML comunes
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Remover espacios en blanco extras y saltos de línea
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Si queda vacío o muy corto (menos de 10 caracteres), retornar vacío
  if (cleaned.length < 10) return '';
  
  return cleaned;
};

export const truncateDescription = (description: string, maxLength: number = 300): string => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
};
