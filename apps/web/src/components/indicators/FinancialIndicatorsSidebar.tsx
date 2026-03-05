'use client';

import { useEffect, useState } from 'react';

interface Indicators {
  usdCop: number | null;
  eurCop: number | null;
  btcUsd: number | null;
  loading: boolean;
  error: string | null;
}

export default function FinancialIndicatorsSidebar() {
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
      }

      // Obtener Bitcoin/USD desde CoinGecko
      try {
        const btcResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          { cache: 'no-store' }
        );
        const btcData = await btcResponse.json();
        
        if (btcData.bitcoin?.usd) {
          btcUsd = Math.round(btcData.bitcoin.usd).toLocaleString('en-US');
        }
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
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
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchIndicators, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (indicators.loading) {
    return (
      <div className="bg-gradient-to-b from-red-700 to-red-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Indicadores</h3>
        <p className="text-sm text-center animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (indicators.error) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-red-700 to-red-800 text-white p-4 rounded-lg shadow-md sticky top-4">
      <h3 className="text-lg font-bold mb-4 text-center">Indicadores Económicos</h3>
      <div className="space-y-4">
        {indicators.usdCop && (
          <div className="bg-red-900/30 p-3 rounded-lg">
            <div className="text-sm font-semibold mb-1">USD/COP</div>
            <div className="text-2xl font-bold text-red-100">${indicators.usdCop}</div>
          </div>
        )}
        {indicators.eurCop && (
          <div className="bg-red-900/30 p-3 rounded-lg">
            <div className="text-sm font-semibold mb-1">EUR/COP</div>
            <div className="text-2xl font-bold text-red-100">${indicators.eurCop}</div>
          </div>
        )}
        {indicators.btcUsd && (
          <div className="bg-red-900/30 p-3 rounded-lg">
            <div className="text-sm font-semibold mb-1">BTC/USD</div>
            <div className="text-2xl font-bold text-red-100">${indicators.btcUsd}</div>
          </div>
        )}
      </div>
    </div>
  );
}
