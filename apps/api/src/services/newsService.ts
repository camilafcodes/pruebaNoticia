import pool from '../db';
import { NewsItem } from '@app/shared';

export const getNewsByCategory = async (
  category: string,
  page: number,
  pageSize: number
): Promise<{ data: NewsItem[]; total: number }> => {
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

export const getTop4Actualidad = async (): Promise<NewsItem[]> => {
  const query = `
    (
      SELECT "newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl", 1 as priority
      FROM news
      WHERE category = 'actualidad' AND flag = true AND image IS NOT NULL
      ORDER BY "newDate" DESC
      LIMIT 4
    )
    UNION ALL
    (
      SELECT "newId", "portalName", "newTitle", "newDate", image, description, content, category, flag, "sourceUrl", 2 as priority
      FROM news
      WHERE category = 'actualidad' AND flag = false AND image IS NOT NULL
      ORDER BY "newDate" DESC
      LIMIT 4
    )
    ORDER BY priority ASC, "newDate" DESC
    LIMIT 4
  `;

  try {
    const result = await pool.query(query);
    
    return result.rows.map((row) => ({
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
