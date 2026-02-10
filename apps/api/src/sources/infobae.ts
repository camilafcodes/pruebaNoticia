import Parser from 'rss-parser';
import { NewsItem } from '@app/shared';
import { extractNewIdFromUrl, cleanHtmlContent, truncateDescription } from '../utils/rssUtils';

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

export const fetchInfobaeNews = async (): Promise<NewsItem[]> => {
  const RSS_URL = 'https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/';
  const PORTAL_NAME = 'Infobae';
  const CATEGORY = 'politica';

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
        image: extractImageFromItem(item) || undefined,
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
