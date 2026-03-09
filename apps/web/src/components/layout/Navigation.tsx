'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageToggle from './LanguageToggle';

const categories = [
  { slug: 'actualidad' },
  { slug: 'politica' },
  { slug: 'economia' },
  { slug: 'deportes' },
  { slug: 'finanzas' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('categories');

  const isActive = (slug: string) => {
    return pathname.startsWith(`/${slug}`);
  };

  return (
    <nav className="bg-red-800 border-b border-red-700 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation - tabs horizontales */}
        <div className="hidden md:flex md:items-center md:justify-between h-14">
          {/* Spacer izquierdo para centrar las categorías */}
          <div className="w-24"></div>
          
          {/* Categorías centradas */}
          <div className="flex items-center space-x-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={`
                  relative px-6 py-4 text-lg font-semibold uppercase tracking-wide
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-red-800
                  ${
                    isActive(category.slug)
                      ? 'text-white'
                      : 'text-red-100 hover:text-white hover:bg-red-700/50'
                  }
                `}
              >
                {t(category.slug)}
                {/* Indicador activo - underline */}
                {isActive(category.slug) && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Toggle de idioma en la esquina derecha */}
          <div className="w-24 flex justify-end">
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Navigation - hamburguesa vertical */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14 px-2">
            {/* Hamburguesa a la izquierda */}
            <button
              className="p-2 rounded-md text-red-100 hover:text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú de navegación"
              aria-expanded={mobileMenuOpen}
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

            {/* Título centrado (opcional) */}
            <div className="flex-1 text-center">
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                {categories.find(cat => isActive(cat.slug)) ? t(categories.find(cat => isActive(cat.slug))!.slug) : 'Menú'}
              </span>
            </div>

            {/* Toggle de idioma a la derecha */}
            <div className="flex items-center">
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile Menu Dropdown - menú vertical */}
          {mobileMenuOpen && (
            <div className="bg-red-900 border-t border-red-700 shadow-lg">
              <div className="py-2 space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-6 py-3 text-sm font-semibold uppercase tracking-wide
                      transition-colors cursor-pointer
                      ${
                        isActive(category.slug)
                          ? 'bg-red-700 text-white border-l-4 border-white'
                          : 'text-red-100 hover:bg-red-700 hover:text-white hover:border-l-4 hover:border-red-300'
                      }
                    `}
                  >
                    {t(category.slug)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS para ocultar scrollbar en móvil pero mantener funcionalidad */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
