export default function Header() {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            La Crónica Nacional
          </h1>
          <p className="text-sm sm:text-base text-gray-600 italic text-center">
            Hechos que el poder no puede ocultar
          </p>
          <p className="text-xs sm:text-sm text-gray-500 capitalize">
            {currentDate}
          </p>
        </div>
      </div>
    </header>
  );
}
