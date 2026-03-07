'use client';

import { NewsItem } from '@app/shared';
import NewsCard from './NewsCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface NewsGridProps {
  news: NewsItem[];
  currentPage: number;
  totalPages: number;
  category: string;
}

export default function NewsGrid({
  news,
  currentPage,
  totalPages,
  category,
}: NewsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('pagination');
  const tMessages = useTranslations('messages');

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/${category}?${params.toString()}`);
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {tMessages('noNews')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {news.map((item) => (
          <NewsCard key={item.newId} news={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t('previous')}
          </button>

          <div className="flex space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-red-800 text-white border-red-800 hover:bg-red-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
}
