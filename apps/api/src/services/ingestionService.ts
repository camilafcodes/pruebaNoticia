import { insertNews, newsExists } from './newsService';
import { fetchQhuboCaliNews } from '../sources/qhubocali';
import { fetchInfobaeNews } from '../sources/infobae';
import { fetchValoraAnalitikNews } from '../sources/valoraanalitik';
import { fetchFutbolredNews } from '../sources/futbolred';
import { fetchElPaisNews } from '../sources/elpais';

export const ingestAllNews = async (): Promise<void> => {
  console.log('Starting news ingestion...');
  const startTime = Date.now();

  const sources = [
    { name: "Q'hubo Cali", fetch: fetchQhuboCaliNews },
    { name: 'Infobae', fetch: fetchInfobaeNews },
    { name: 'Valora Analitik', fetch: fetchValoraAnalitikNews },
    { name: 'Futbolred', fetch: fetchFutbolredNews },
    { name: 'El País', fetch: fetchElPaisNews },
  ];

  let totalIngested = 0;
  let totalSkipped = 0;

  for (const source of sources) {
    try {
      console.log(`Fetching news from ${source.name}...`);
      const newsItems = await source.fetch();
      
      let ingested = 0;
      let skipped = 0;

      for (const item of newsItems) {
        try {
          const exists = await newsExists(item.newId);
          if (exists) {
            skipped++;
            continue;
          }

          await insertNews(item);
          ingested++;
        } catch (error) {
          console.error(`Error inserting news item ${item.newId}:`, error);
          skipped++;
        }
      }

      console.log(`${source.name}: ${ingested} new items ingested, ${skipped} skipped`);
      totalIngested += ingested;
      totalSkipped += skipped;
    } catch (error) {
      console.error(`Failed to fetch news from ${source.name}:`, error);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`News ingestion completed in ${duration}s. Total: ${totalIngested} ingested, ${totalSkipped} skipped`);
};
