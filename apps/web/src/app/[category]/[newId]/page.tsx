import { Metadata } from 'next';
import { fetchNewsByCategory, fetchTop4Actualidad } from '@/lib/api';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';
import { Category } from '@app/shared';

const categoryNames: Record<Category, string> = {
  actualidad: 'Actualidad',
  politica: 'Política',
  economia: 'Economía',
  deportes: 'Deportes',
  finanzas: 'Finanzas',
};

interface NewsDetailPageProps {
  params: Promise<{ category: string; newId: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { category, newId } = await params;
  
  try {
    const response = await fetchNewsByCategory(category, 1, 100);
    const newsItem = response.data.find((item) => item.newId === newId);

    if (newsItem) {
      return {
        title: `${newsItem.newTitle} - La Crónica Nacional`,
        description: newsItem.description || newsItem.newTitle,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Noticia - La Crónica Nacional',
    description: 'Hechos que el poder no puede ocultar',
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { category, newId } = await params;

  const [newsResponse, top4Response] = await Promise.all([
    fetchNewsByCategory(category, 1, 100),
    fetchTop4Actualidad(),
  ]);

  const newsItem = newsResponse.data.find((item) => item.newId === newId);

  if (!newsItem) {
    throw new Error('News item not found');
  }

  const formattedDate = new Date(newsItem.newDate).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${category}`}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a {categoryNames[category as Category]}
      </Link>

      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 lg:p-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-900 rounded-full uppercase">
              {categoryNames[category as Category]}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {newsItem.newTitle}
          </h1>

          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span className="font-medium">{newsItem.portalName}</span>
            <span className="mx-2">•</span>
            <time dateTime={newsItem.newDate}>{formattedDate}</time>
          </div>

          {newsItem.image && (
            <div className="mb-6">
              <img
                src={newsItem.image}
                alt={newsItem.newTitle}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {newsItem.description && (
            <p className="text-xl text-gray-700 mb-6 font-medium">
              {newsItem.description}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </div>
      </article>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Últimas Noticias de Actualidad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {top4Response.data.map((item) => (
            <NewsCard key={item.newId} news={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
