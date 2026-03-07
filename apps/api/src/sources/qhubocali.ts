import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, cleanDescriptionFromHtml, truncateDescription, removeFirstFigureTag } from '../utils/rssUtils';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

export const fetchQhuboCaliNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://www.lasillavacia.com/feed/';
  const PORTAL_NAME = 'La Silla Vacía';
  const CATEGORY = 'politica';

  try {
    const feed = await parser.parseURL(RSS_URL);
    const newsItems: NewsItem[] = [];

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const newId = extractNewIdFromUrl(item.link);
      const rawContent = item.contentEncoded || item.content || item.description || '';
      const rawDescription = item.description || '';
      
      // Limpiar descripción de tags HTML
      const cleanedDescription = cleanDescriptionFromHtml(rawDescription);
      
      // Extraer imagen del contenido HTML
      const image = extractImageFromContent(rawContent);
      
      // Remover primera etiqueta <figure> para evitar duplicación de imagen
      const contentWithoutFirstFigure = removeFirstFigureTag(rawContent);

      newsItems.push({
        newId,
        portalName: PORTAL_NAME,
        newTitle: item.title,
        newDate: item.pubDate || item.isoDate || new Date().toISOString(),
        image: image || undefined,
        description: cleanedDescription ? truncateDescription(cleanedDescription) : '',
        content: cleanHtmlContent(contentWithoutFirstFigure),
        category: CATEGORY,
        flag: false,
      });
    }

    return newsItems;
  } catch (error) {
    console.error(`Error fetching ${PORTAL_NAME} news:`, error);
    return [];
  }
};

const extractImageFromContent = (content: string): string | null => {
  if (!content) return null;
  
  // Buscar img tag en el contenido
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch ? imgMatch[1] : null;
};
