'use client';

import { useEffect, useState } from 'react';

interface Match {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
}

export default function SportsScores() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Obtener partidos del día desde TheSportsDB (API pública gratuita)
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${dateStr}&l=4335,4336`,
          { cache: 'no-store' }
        );
        const data = await response.json();
        
        if (data.events) {
          // Limitar a 6 partidos más recientes
          setMatches(data.events.slice(0, 6));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sports scores:', error);
        setLoading(false);
      }
    };

    fetchMatches();
    // Actualizar cada 3 minutos
    const interval = setInterval(fetchMatches, 3 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null; // No mostrar nada mientras carga
  }

  if (matches.length === 0) {
    return null; // No mostrar la sección si no hay partidos
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">⚽ Resultados Deportivos</h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.idEvent} className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-2 font-medium">
              {match.strLeague}
            </div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{match.strHomeTeam}</div>
              </div>
              <div className="mx-3 text-lg font-bold text-gray-900">
                {match.intHomeScore ?? '-'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{match.strAwayTeam}</div>
              </div>
              <div className="mx-3 text-lg font-bold text-gray-900">
                {match.intAwayScore ?? '-'}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-right">
              {match.strTime ? match.strTime : 'Programado'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
