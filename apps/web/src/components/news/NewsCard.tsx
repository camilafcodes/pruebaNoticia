import Link from 'next/link';
import { NewsItem } from '@app/shared';
import FormattedDate from '../common/FormattedDate';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  // Función para limpiar HTML tags de la descripción
  const cleanDescription = (html: string | undefined): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <Link
      href={`/${news.category}/${news.newId}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {news.image && (
        <div className="relative w-full h-48 bg-gray-200">
          <img
            src={news.image}
            alt={news.newTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {news.portalName}
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {news.newTitle}
        </h3>
        {news.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {cleanDescription(news.description)}
          </p>
        )}
        <p className="text-xs text-gray-400">
          <FormattedDate date={news.newDate} format="short" />
        </p>
      </div>
    </Link>
  );
}
