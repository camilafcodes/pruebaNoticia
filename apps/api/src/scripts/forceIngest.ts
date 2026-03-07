import { fetchFutbolredNews } from '../sources/futbolred';
import { fetchValoraAnalitikNews } from '../sources/valoraanalitik';
import { fetchQhuboCaliNews } from '../sources/qhubocali';
import { fetchElPaisNews } from '../sources/elpais';
import { fetchInfobaeNews } from '../sources/infobae';
import pool from '../db';

const forceIngestion = async () => {
  console.log('=== Iniciando ingesta forzada ===\n');

  try {
    // Deportes
    console.log('Ingesting deportes (El Tiempo)...');
    const deportes = await fetchFutbolredNews();
    for (const item of deportes) {
      await pool.query(
        `INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT ("newId") DO UPDATE SET
           "newDate" = EXCLUDED."newDate",
           content = EXCLUDED.content,
           "sourceUrl" = EXCLUDED."sourceUrl"`,
        [item.newId, item.portalName, item.newTitle, item.newDate, item.image, item.description, item.content, item.category, item.flag, item.sourceUrl]
      );
    }
    console.log(`✓ Deportes: ${deportes.length} noticias\n`);

    // Economía
    console.log('Ingesting economía (Valora Analitik)...');
    const economia = await fetchValoraAnalitikNews();
    for (const item of economia) {
      await pool.query(
        `INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT ("newId") DO UPDATE SET
           "newDate" = EXCLUDED."newDate",
           content = EXCLUDED.content,
           "sourceUrl" = EXCLUDED."sourceUrl"`,
        [item.newId, item.portalName, item.newTitle, item.newDate, item.image, item.description, item.content, item.category, item.flag, item.sourceUrl]
      );
    }
    console.log(`✓ Economía: ${economia.length} noticias\n`);

    // Política
    console.log('Ingesting política (La Silla Vacía)...');
    const politica = await fetchQhuboCaliNews();
    for (const item of politica) {
      await pool.query(
        `INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT ("newId") DO UPDATE SET
           "newDate" = EXCLUDED."newDate",
           content = EXCLUDED.content,
           "sourceUrl" = EXCLUDED."sourceUrl"`,
        [item.newId, item.portalName, item.newTitle, item.newDate, item.image, item.description, item.content, item.category, item.flag, item.sourceUrl]
      );
    }
    console.log(`✓ Política: ${politica.length} noticias\n`);

    // Finanzas
    console.log('Ingesting finanzas (El País)...');
    const finanzas = await fetchElPaisNews();
    for (const item of finanzas) {
      await pool.query(
        `INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT ("newId") DO UPDATE SET
           "newDate" = EXCLUDED."newDate",
           content = EXCLUDED.content,
           "sourceUrl" = EXCLUDED."sourceUrl"`,
        [item.newId, item.portalName, item.newTitle, item.newDate, item.image, item.description, item.content, item.category, item.flag, item.sourceUrl]
      );
    }
    console.log(`✓ Finanzas: ${finanzas.length} noticias\n`);

    // Actualidad
    console.log('Ingesting actualidad (Infobae)...');
    const actualidad = await fetchInfobaeNews();
    for (const item of actualidad) {
      await pool.query(
        `INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT ("newId") DO UPDATE SET
           "newDate" = EXCLUDED."newDate",
           content = EXCLUDED.content,
           "sourceUrl" = EXCLUDED."sourceUrl"`,
        [item.newId, item.portalName, item.newTitle, item.newDate, item.image, item.description, item.content, item.category, item.flag, item.sourceUrl]
      );
    }
    console.log(`✓ Actualidad: ${actualidad.length} noticias\n`);

    console.log('=== Ingesta completada exitosamente ===');
    process.exit(0);
  } catch (error) {
    console.error('Error en ingesta:', error);
    process.exit(1);
  }
};

forceIngestion();
