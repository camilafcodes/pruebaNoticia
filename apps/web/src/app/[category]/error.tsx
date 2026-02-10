'use client';

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
          Oops! Algo salió mal
        </h2>
        <p className="text-gray-600 mb-6">
          No pudimos cargar las noticias. Por favor, intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
