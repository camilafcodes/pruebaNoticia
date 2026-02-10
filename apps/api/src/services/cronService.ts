import cron from 'node-cron';
import { ingestAllNews } from '../services/ingestionService';

export const startCronJobs = (): void => {
  cron.schedule('0 6,12,18 * * *', async () => {
    console.log('Cron job triggered: Starting scheduled news ingestion');
    try {
      await ingestAllNews();
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  }, {
    timezone: 'America/Bogota'
  });

  console.log('Cron jobs scheduled: 6 AM, 12 PM, 6 PM (Colombia time)');
};
