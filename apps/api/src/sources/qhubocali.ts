import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, truncateDescription } from '../utils/rssUtils';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

export const fetchQhuboCaliNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://www.qhubocali.com/feed/';
  const PORTAL_NAME = "Q'hubo Cali";
  const CATEGORY = 'actualidad';

  try {
    const feed = await parser.parseURL(RSS_URL);
    const newsItems: NewsItem[] = [];

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const newId = extractNewIdFromUrl(item.link);
      const content = item.contentEncoded || item.content || item.description || '';
      const description = item.description || '';

      newsItems.push({
        newId,
        portalName: PORTAL_NAME,
        newTitle: item.title,
        newDate: item.pubDate || item.isoDate || new Date().toISOString(),
        image: extractImageFromContent(content) || undefined,
        description: truncateDescription(description),
        content: cleanHtmlContent(content),
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
  // Primero intentar obtener la imagen principal del div post-thumbnail
  const thumbnailMatch = content.match(/<div class="post-thumbnail"[^>]*>(.*?)<\/div>/s);
  if (thumbnailMatch) {
    const imgMatch = thumbnailMatch[1].match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  
  // Fallback: buscar cualquier imagen en el contenido
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
};
