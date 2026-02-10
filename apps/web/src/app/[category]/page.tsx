import { Metadata } from 'next';
import { fetchNewsByCategory } from '@/lib/api';
import NewsGrid from '@/components/news/NewsGrid';
import { Category } from '@app/shared';

const validCategories: Category[] = [
  'actualidad',
  'politica',
  'economia',
  'deportes',
  'finanzas',
];

const categoryNames: Record<Category, string> = {
  actualidad: 'Actualidad',
  politica: 'Política',
  economia: 'Economía',
  deportes: 'Deportes',
  finanzas: 'Finanzas',
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = categoryNames[category as Category] || category;

  return {
    title: `${categoryName} - La Crónica Nacional`,
    description: `Últimas noticias de ${categoryName.toLowerCase()}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;

  if (!validCategories.includes(category as Category)) {
    throw new Error('Invalid category');
  }

  const page = pageParam ? parseInt(pageParam) : 1;
  const response = await fetchNewsByCategory(category, page, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        {categoryNames[category as Category]}
      </h2>
      <NewsGrid
        news={response.data}
        currentPage={response.page}
        totalPages={response.totalPages}
        category={category}
      />
    </div>
  );
}
