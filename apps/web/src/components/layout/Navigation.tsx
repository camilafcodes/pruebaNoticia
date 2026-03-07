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

        {/* Mobile Navigation - scroll horizontal + hamburguesa */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-12">
            {/* Scroll horizontal de categorías */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    className={`
                      relative flex-shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wide
                      rounded-full transition-colors
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                      ${
                        isActive(category.slug)
                          ? 'bg-white text-red-900'
                          : 'bg-red-700/50 text-red-100 hover:bg-red-700 hover:text-white'
                      }
                    `}
                  >
                    {t(category.slug)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Language toggle y hamburger en mobile */}
            <div className="flex items-center space-x-2 ml-2">
              <LanguageToggle />
              <button
                className="flex-shrink-0 p-2 rounded-md text-red-100 hover:text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menú adicional"
              >
                <svg
                  className="h-5 w-5"
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
          </div>

          {/* Mobile Menu Dropdown (opcional - para búsqueda, etc.) */}
          {mobileMenuOpen && (
            <div className="pb-3 pt-2 space-y-2 border-t border-red-700">
              <button className="w-full text-left px-4 py-2 text-sm text-red-100 hover:bg-red-700 hover:text-white rounded transition-colors">
                🔍 Buscar
              </button>
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
