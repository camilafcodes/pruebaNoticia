import Image from 'next/image';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-gradient-to-b from-red-800 to-red-900 border-b-4 border-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {/* Logo Principal */}
          <div className="relative w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28">
            <Image
              src="/logo.jpeg"
              alt="La Crónica Nacional - Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Título y Slogan como texto alternativo */}
          <div className="flex flex-col items-center space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg">
              La Crónica Nacional
            </h1>
          </div>

          {/* Logo del Slogan */}
          <div className="relative w-48 h-8 sm:w-64 sm:h-10 md:w-80 md:h-12">
            <Image
              src="/slogan.png"
              alt="Hechos que el poder no puede ocultar"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Fecha */}
          <p className="text-xs sm:text-sm text-red-100 capitalize mt-2">
            {currentDate}
          </p>
        </div>
      </div>
    </header>
  );
}
