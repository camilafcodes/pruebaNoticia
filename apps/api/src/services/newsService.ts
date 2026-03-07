import pool from '../db';
import { NewsItem } from '@app/shared';

export const getNewsByCategory = async (
  category: string,
  page: number,
  pageSize: number
): Promise<{ data: NewsItem[]; total: number }> => {
  // Si es Actualidad página 1, usar lógica de intercalado con noticias flag
  if (category === 'actualidad' && page === 1 && pageSize === 9) {
    return getActualidadWithFlagIntercalation();
  }

  const offset = (page - 1) * pageSize;

  const countQuery = 'SELECT COUNT(*) FROM news WHERE category = $1 AND image IS NOT NULL';
  const dataQuery = `
    SELECT "newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl"
    FROM news
    WHERE category = $1 AND image IS NOT NULL
    ORDER BY "newDate" DESC
    LIMIT $2 OFFSET $3
  `;

  try {
    const countResult = await pool.query(countQuery, [category]);
    const total = parseInt(countResult.rows[0].count);

    const dataResult = await pool.query(dataQuery, [category, pageSize, offset]);
    
    const data = dataResult.rows.map((row) => ({
      newId: row.newId,
      portalName: row.portalName,
      newTitle: row.newTitle,
      newDate: row.newDate,
      image: row.image,
      description: row.description,
      content: row.content,
      category: row.category,
      flag: row.flag,
      sourceUrl: row.sourceUrl,
    }));

    return { data, total };
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
};

// Función auxiliar para intercalar noticias flag en posiciones 2, 6, 7
const getActualidadWithFlagIntercalation = async (): Promise<{ data: NewsItem[]; total: number }> => {
  try {
    // Obtener noticias destacadas (flag=true), máximo 3
    const flagQuery = `
      SELECT "newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl"
      FROM news
      WHERE category = 'actualidad' AND flag = true AND image IS NOT NULL
      ORDER BY "newDate" DESC
      LIMIT 3
    `;
    
    // Obtener noticias normales (flag=false), máximo 9 para llenar los espacios
    const normalQuery = `
      SELECT "newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl"
      FROM news
      WHERE category = 'actualidad' AND flag = false AND image IS NOT NULL
      ORDER BY "newDate" DESC
      LIMIT 9
    `;

    // Obtener el total para paginación
    const countQuery = 'SELECT COUNT(*) FROM news WHERE category = $1 AND image IS NOT NULL';

    const [flagResult, normalResult, countResult] = await Promise.all([
      pool.query(flagQuery),
      pool.query(normalQuery),
      pool.query(countQuery, ['actualidad'])
    ]);

    const total = parseInt(countResult.rows[0].count);

    const flagNews = flagResult.rows.map((row) => ({
      newId: row.newId,
      portalName: row.portalName,
      newTitle: row.newTitle,
      newDate: row.newDate,
      image: row.image,
      description: row.description,
      content: row.content,
      category: row.category,
      flag: row.flag,
      sourceUrl: row.sourceUrl,
    }));

    const normalNews = normalResult.rows.map((row) => ({
      newId: row.newId,
      portalName: row.portalName,
      newTitle: row.newTitle,
      newDate: row.newDate,
      image: row.image,
      description: row.description,
      content: row.content,
      category: row.category,
      flag: row.flag,
      sourceUrl: row.sourceUrl,
    }));

    // Intercalar noticias: las flag van en posiciones 2, 6 y 7 (índices 1, 5, 6)
    // Layout de 9 noticias (3x3):
    // Pos 1, 2, 3
    // Pos 4, 5, 6
    // Pos 7, 8, 9
    const data: NewsItem[] = [];
    let normalIndex = 0;
    let flagIndex = 0;

    for (let i = 0; i < 9; i++) {
      // Posiciones para noticias flag: 2, 6, 7 (índices 1, 5, 6)
      if ((i === 1 || i === 5 || i === 6) && flagIndex < flagNews.length) {
        data.push(flagNews[flagIndex]);
        flagIndex++;
      } else if (normalIndex < normalNews.length) {
        data.push(normalNews[normalIndex]);
        normalIndex++;
      }
    }

    return { data, total };
  } catch (error) {
    console.error('Error fetching actualidad with flag intercalation:', error);
    throw error;
  }
};

export const getTop4Actualidad = async (): Promise<NewsItem[]> => {
  try {
    const result = await getActualidadWithFlagIntercalation();
    return result.data;
  } catch (error) {
    console.error('Error fetching top 4 actualidad:', error);
    throw error;
  }
};

export const insertNews = async (news: NewsItem): Promise<void> => {
  const query = `
    INSERT INTO news ("newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT ("newId") DO NOTHING
  `;

  const values = [
    news.newId,
    news.portalName,
    news.newTitle,
    news.newDate,
    news.image || null,
    news.description || null,
    news.content,
    news.category,
    news.flag,
    news.sourceUrl || null,
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting news:', error);
    throw error;
  }
};

export const newsExists = async (newId: string): Promise<boolean> => {
  const query = 'SELECT 1 FROM news WHERE "newId" = $1 LIMIT 1';
  
  try {
    const result = await pool.query(query, [newId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking if news exists:', error);
    throw error;
  }
};

export const updateFlaggedActualidadDates = async (): Promise<number> => {
  const query = `
    UPDATE news
    SET "newDate" = NOW()
    WHERE category = 'actualidad' AND flag = true
  `;
  
  try {
    const result = await pool.query(query);
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error updating flagged actualidad dates:', error);
    throw error;
  }
};
