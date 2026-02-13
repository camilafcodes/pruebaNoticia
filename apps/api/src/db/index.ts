import { Pool } from 'pg';

// Parse DATABASE_URL or use individual env vars
const databaseUrl = process.env.DATABASE_URL;
let poolConfig: any = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

if (databaseUrl) {
  // Parse the URL manually to ensure password is treated as string
  const url = new URL(databaseUrl);
  poolConfig = {
    ...poolConfig,
    host: url.hostname,
    port: parseInt(url.port, 10),
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
  };
} else {
  // Fallback to individual env vars
  poolConfig = {
    ...poolConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'news_portal',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
