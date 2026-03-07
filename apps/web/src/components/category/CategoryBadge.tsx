'use client';

import { useTranslations } from 'next-intl';
import { Category } from '@app/shared';

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const t = useTranslations('categories');

  return (
    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-900 rounded-full uppercase">
      {t(category)}
    </span>
  );
}
