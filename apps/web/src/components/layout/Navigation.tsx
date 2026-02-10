'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const categories = [
  { name: 'Actualidad', slug: 'actualidad' },
  { name: 'Política', slug: 'politica' },
  { name: 'Economía', slug: 'economia' },
  { name: 'Deportes', slug: 'deportes' },
  { name: 'Finanzas', slug: 'finanzas' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (slug: string) => {
    return pathname.startsWith(`/${slug}`);
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex md:space-x-8 md:mx-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(category.slug)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(category.slug)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
