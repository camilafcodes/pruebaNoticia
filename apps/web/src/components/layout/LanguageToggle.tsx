'use client';

import { useLocale, type Locale } from '@/i18n/LocaleProvider';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'es' ? 'en' : 'es';
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-red-100 hover:text-white font-semibold text-sm tracking-wide transition-colors duration-200 cursor-pointer"
      aria-label="Cambiar idioma"
    >
      <span className={locale === 'es' ? 'text-white' : ''}>ESP</span>
      <span className="mx-1">|</span>
      <span className={locale === 'en' ? 'text-white' : ''}>ENG</span>
    </button>
  );
}
