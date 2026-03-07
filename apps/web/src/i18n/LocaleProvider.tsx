'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

// Idiomas soportados
export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Leer idioma guardado en localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    const initialLocale = savedLocale && (savedLocale === 'es' || savedLocale === 'en') 
      ? savedLocale 
      : defaultLocale;
    
    setLocaleState(initialLocale);
    
    // Cargar mensajes
    import(`../../messages/${initialLocale}.json`)
      .then((module) => {
        setMessages(module.default);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const setLocale = async (newLocale: Locale) => {
    setIsLoading(true);
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
    
    // Cargar nuevos mensajes
    try {
      const module = await import(`../../messages/${newLocale}.json`);
      setMessages(module.default);
    } catch (error) {
      console.error('Error loading locale:', error);
    }
    setIsLoading(false);
  };

  if (isLoading || !messages) {
    return null; // O un skeleton/loader
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
