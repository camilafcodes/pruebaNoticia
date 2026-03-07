import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, truncateDescription, removeFirstFigureTag } from '../utils/rssUtils';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

export const fetchValoraAnalitikNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://www.valoraanalitik.com/feed/';
  const PORTAL_NAME = 'Valora Analitik';
  const CATEGORY = 'economia';

  try {
    const feed = await parser.parseURL(RSS_URL);
    const newsItems: NewsItem[] = [];

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const newId = extractNewIdFromUrl(item.link);
      const rawContent = item.contentEncoded || item.content || item.description || '';
      const description = item.description || '';
      
      // Extraer imagen del contenido HTML
      const image = extractImageFromContent(rawContent);
      
      // Remover primera etiqueta <figure> para evitar duplicación de imagen
      const contentWithoutFirstFigure = removeFirstFigureTag(rawContent);
      
      // Agregar link "Seguir leyendo" al final del contenido usando la URL original
      const cleanedContent = cleanHtmlContent(contentWithoutFirstFigure);
      const contentWithLink = cleanedContent + `<p><a href="${item.link}" target="_blank">Seguir leyendo</a></p>`;

      newsItems.push({
        newId,
        portalName: PORTAL_NAME,
        newTitle: item.title,
        newDate: item.pubDate || item.isoDate || new Date().toISOString(),
        image: image || undefined,
        description: truncateDescription(description),
        content: contentWithLink,
        category: CATEGORY,
        flag: false,
        sourceUrl: item.link,
      });
    }

    return newsItems;
  } catch (error) {
    console.error(`Error fetching ${PORTAL_NAME} news:`, error);
    return [];
  }
};

const extractImageFromContent = (content: string): string | null => {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
};
