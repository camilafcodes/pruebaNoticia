import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, truncateDescription } from '../utils/rssUtils';

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

export const fetchFutbolredNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://columnadigital.com/category/deportes/feed/gn';
  const PORTAL_NAME = 'Columna Digital';
  const CATEGORY = 'deportes';

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
        image: undefined, // Columna Digital tiene protección anti-hotlinking, no usar imágenes
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
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
};
