'use client';

import { useEffect, useState } from 'react';

interface Indicators {
  usdCop: any;
  eurCop: any;
  btcUsd: any;
  loading: boolean;
  error: string | null;
}

export default function FinancialIndicators() {
  const [indicators, setIndicators] = useState<Indicators>({
    usdCop: null,
    eurCop: null,
    btcUsd: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchIndicators = async () => {
      let usdCop = null;
      let eurCop = null;
      let btcUsd = null;

      // Obtener USD/COP y EUR/COP
      try {
        const exchangeResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/COP',
          { cache: 'no-store' }
        );
        const exchangeData = await exchangeResponse.json();
        
        if (exchangeData.rates?.USD) {
          usdCop = (1 / exchangeData.rates.USD).toFixed(2);
        }
        if (exchangeData.rates?.EUR) {
          eurCop = (1 / exchangeData.rates.EUR).toFixed(2);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Mantener valores anteriores si falló
        usdCop = indicators.usdCop;
        eurCop = indicators.eurCop;
      }

      // Obtener Bitcoin/USD desde CoinGecko
      try {
        const btcResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          { cache: 'no-store' }
        );
        
        if (!btcResponse.ok) {
          throw new Error(`HTTP ${btcResponse.status}`);
        }
        
        const btcData = await btcResponse.json();
        
        if (btcData.bitcoin?.usd) {
          btcUsd = Math.round(btcData.bitcoin.usd).toLocaleString('en-US');
        }
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        // Mantener valor anterior si falló (rate limiting)
        btcUsd = indicators.btcUsd;
      }

      setIndicators({
        usdCop,
        eurCop,
        btcUsd,
        loading: false,
        error: (!usdCop && !eurCop && !btcUsd) ? 'Error al cargar indicadores' : null,
      });
    };

    fetchIndicators();
    // Actualizar cada 10 minutos (evitar rate limiting de CoinGecko)
    const interval = setInterval(fetchIndicators, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (indicators.loading) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-950 text-white py-3 mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-center animate-pulse">Cargando indicadores...</p>
        </div>
      </div>
    );
  }

  if (indicators.error) {
    return null; // No mostrar nada si hay error
  }

  return (
    <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-3 mb-6 rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base">
          {indicators.usdCop && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">USD/COP:</span>
              <span className="text-red-100">${indicators.usdCop}</span>
            </div>
          )}
          {indicators.eurCop && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">EUR/COP:</span>
              <span className="text-red-100">${indicators.eurCop}</span>
            </div>
          )}
          {indicators.btcUsd && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">BTC/USD:</span>
              <span className="text-red-100">${indicators.btcUsd}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
