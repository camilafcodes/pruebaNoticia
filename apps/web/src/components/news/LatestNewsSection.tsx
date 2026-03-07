'use client';

import { useTranslations } from 'next-intl';
import { NewsItem } from '@app/shared';
import NewsCard from './NewsCard';

interface LatestNewsSectionProps {
  news: NewsItem[];
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = useTranslations('messages');

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('latestNews')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.newId} news={item} />
        ))}
      </div>
    </section>
  );
}
