'use client';

import { useLocale } from '@/i18n/LocaleProvider';

interface FormattedDateProps {
  date: Date | string;
  format?: 'short' | 'long';
}

export default function FormattedDate({ date, format = 'long' }: FormattedDateProps) {
  const { locale } = useLocale();
  
  const localeString = locale === 'es' ? 'es-CO' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = format === 'short' 
    ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    : {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

  const formattedDate = dateObj.toLocaleDateString(localeString, options);

  return <>{formattedDate}</>;
}
