import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, truncateDescription, removeFirstImageTag } from '../utils/rssUtils';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['media:content', 'mediaContent'],
    ],
  },
});

export const fetchElPaisNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a';
  const PORTAL_NAME = 'El País';
  const CATEGORY = 'finanzas';

  try {
    const feed = await parser.parseURL(RSS_URL);
    const newsItems: NewsItem[] = [];

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const newId = extractNewIdFromUrl(item.link);
      const rawContent = item.contentEncoded || item.content || item.description || '';
      const description = item.description || '';
      
      // Extraer imagen del item
      const image = extractImageFromItem(item);
      
      // Remover primera etiqueta <img> para evitar duplicación de imagen
      const contentWithoutFirstImage = removeFirstImageTag(rawContent);

      newsItems.push({
        newId,
        portalName: PORTAL_NAME,
        newTitle: item.title,
        newDate: item.pubDate || item.isoDate || new Date().toISOString(),
        image: image || undefined,
        description: truncateDescription(description),
        content: cleanHtmlContent(contentWithoutFirstImage),
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

const extractImageFromItem = (item: any): string | null => {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  if (item.mediaContent && item.mediaContent.$?.url) {
    return item.mediaContent.$.url;
  }
  
  const content = item.contentEncoded || item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
};
