'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Noticia no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos encontrar la noticia que buscas.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/actualidad"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
