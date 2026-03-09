'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n/LocaleProvider';

export default function Header() {
  const tNav = useTranslations('navigation');
  const tMeta = useTranslations('metadata');
  const { locale } = useLocale();
  
  const localeString = locale === 'es' ? 'es-CO' : 'en-US';
  
  const currentDate = new Date().toLocaleDateString(localeString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-gradient-to-b from-red-900 to-red-950 border-b-2 border-red-950">
      {/* Branding Bar - Layout en 2 columnas según referencia */}
      <div className="bg-gradient-to-br from-red-800 via-red-900 to-red-950 relative">
        {/* Franja de fecha que cruza todo el ancho */}
        <div className="absolute top-7 sm:top-9 left-0 right-0 bg-red-200 py-1 z-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <time className="text-xs sm:text-sm text-red-900 capitalize font-medium">
              {currentDate}
            </time>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-2 lg:py-3 items-center">
            {/* Columna izquierda: Título + Slogan (centrados) */}
            <div className="lg:col-span-8 flex flex-col items-center lg:items-start space-y-2 lg:pr-8 pt-14 sm:pt-12 lg:pt-8">
              {/* Título centrado en su espacio */}
              <div className="flex-1 flex flex-col justify-center items-center w-full space-y-1 lg:ml-5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight tracking-tight">
                  {tNav('siteTitle')}
                </h1>
                
                {/* Miniatura Logo */}
                <div className="relative w-24 h-14 sm:w-28 sm:h-16">
                  <Image
                    src="/miniaturaLogo.png"
                    alt="Logo miniatura"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </div>
                
                {/* Slogan en texto */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-red-100 italic text-center font-light">
                  {tMeta('siteDescription')}
                </p>
              </div>
            </div>

            {/* Columna derecha: Logo principal grande */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-72 h-48 sm:w-80 sm:h-56 md:w-[22rem] md:h-60 lg:w-[26rem] lg:h-[17rem] -mt-3 lg:-mt-6 lg:-mr-4 z-20">
                <Image
                  src="/logo.jpeg"
                  alt="La Crónica Nacional - Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 352px, 416px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
