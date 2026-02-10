import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const sqlPath = path.join(__dirname, '../../../../product_docs/news-portal-database-model.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('CREATE DATABASE')) {
        console.log('Skipping CREATE DATABASE statement (should be done manually)');
        continue;
      }
      
      if (statement.includes('COMMENT ON')) {
        try {
          await client.query(statement);
        } catch (error) {
          console.log('Comment statement skipped');
        }
        continue;
      }

      try {
        await client.query(statement);
        console.log('Executed statement successfully');
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log('Object already exists, continuing...');
        } else {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

initDatabase();
