'use client';

import { useTranslations } from 'next-intl';
import { Category } from '@app/shared';

interface CategoryHeaderProps {
  category: Category;
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  const t = useTranslations('categories');

  return (
    <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
      {t(category)}
    </h2>
  );
}
