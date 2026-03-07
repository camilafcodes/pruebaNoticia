'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Category } from '@app/shared';

interface BackLinkProps {
  category: Category;
}

export default function BackLink({ category }: BackLinkProps) {
  const tNav = useTranslations('navigation');
  const tCat = useTranslations('categories');

  return (
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
      {tNav('backTo')} {tCat(category)}
    </Link>
  );
}
