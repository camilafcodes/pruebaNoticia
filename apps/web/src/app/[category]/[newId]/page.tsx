import { Metadata } from 'next';
import { fetchNewsByCategory, fetchTop4Actualidad } from '@/lib/api';
import NewsCard from '@/components/news/NewsCard';
import FinancialIndicatorsSidebar from '@/components/indicators/FinancialIndicatorsSidebar';
import SportsScores from '@/components/sports/SportsScores';
import BackLink from '@/components/navigation/BackLink';
import FormattedDate from '@/components/common/FormattedDate';
import CategoryBadge from '@/components/category/CategoryBadge';
import LatestNewsSection from '@/components/news/LatestNewsSection';
import { Category } from '@app/shared';

interface NewsDetailPageProps {
  params: Promise<{ category: string; newId: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { category, newId } = await params;
  
  try {
    const response = await fetchNewsByCategory(category, 1, 50);
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
    fetchNewsByCategory(category, 1, 50),
    fetchTop4Actualidad(),
  ]);

  const newsItem = newsResponse.data.find((item) => item.newId === newId);

  if (!newsItem) {
    throw new Error('News item not found');
  }

  // Función para limpiar HTML tags
  const cleanDescription = (html: string | undefined): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackLink category={category as Category} />

      {/* Layout de 2 columnas: 70% contenido + 30% sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8">
        {/* Columna principal - 70% */}
        <div className="lg:col-span-7">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="py-6 px-4 lg:py-8 lg:px-6">
              <div className="mb-4">
                <CategoryBadge category={category as Category} />
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {newsItem.newTitle}
              </h1>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span className="font-medium">{newsItem.portalName}</span>
                <span className="mx-2">•</span>
                <time dateTime={newsItem.newDate}>
                  <FormattedDate date={newsItem.newDate} format="long" />
                </time>
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
                <p className="text-xl text-gray-700 mb-6 font-medium text-justify">
                  {cleanDescription(newsItem.description)}
                </p>
              )}

              <div
                className="prose prose-lg max-w-none text-justify prose-p:mx-0 prose-p:my-4"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />
            </div>
          </article>
        </div>

        {/* Sidebar - 30% */}
        <div className="lg:col-span-3">
          <FinancialIndicatorsSidebar />
          <SportsScores />
        </div>
      </div>

      <LatestNewsSection news={top4Response.data} />
    </div>
  );
}
