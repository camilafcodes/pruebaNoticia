import Image from 'next/image';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-gradient-to-b from-red-900 to-red-950 border-b-2 border-red-950">
      {/* Branding Bar - Layout en 2 columnas según referencia */}
      <div className="bg-gradient-to-br from-red-800 via-red-900 to-red-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-2 lg:py-3 items-center">
            {/* Columna izquierda: Fecha + Título + Slogan (centrados) */}
            <div className="lg:col-span-8 flex flex-col items-center lg:items-start space-y-2 lg:pr-8">
              {/* Fecha arriba a la izquierda */}
              <time className="text-xs sm:text-sm text-red-100 capitalize font-light self-start lg:self-start">
                {currentDate}
              </time>
              
              {/* Título centrado en su espacio */}
              <div className="flex-1 flex flex-col justify-center items-center w-full space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight tracking-tight">
                  La Crónica Nacional
                </h1>
                
                {/* Logo del Slogan sin fondo - centrado debajo del título */}
                <div className="relative w-64 h-11 sm:w-80 sm:h-14 md:w-[22rem] md:h-16 lg:w-[26rem] lg:h-[4.5rem]">
                  <Image
                    src="/slogan-sinfondo.png"
                    alt="Hechos que el poder no puede ocultar"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 352px, 416px"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha: Logo principal grande */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-56 h-36 sm:w-64 sm:h-44 md:w-72 md:h-48 lg:w-80 lg:h-56">
                <Image
                  src="/logo.jpeg"
                  alt="La Crónica Nacional - Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
