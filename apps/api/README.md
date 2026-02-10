# News Portal API

Backend API for La Crónica Nacional news portal. This API aggregates news from multiple RSS feeds and provides endpoints to access categorized news content.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **RSS Parsing:** rss-parser
- **Cron Jobs:** node-cron

## Features

- ✅ RSS feed ingestion from 5 news sources
- ✅ Automatic deduplication by article ID
- ✅ Scheduled ingestion (6 AM, 12 PM, 6 PM Colombia time)
- ✅ Paginated news endpoints by category
- ✅ Priority-based "Top 4" actualidad endpoint
- ✅ Input validation and consistent error handling
- ✅ CORS support for frontend integration

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Environment variables configured

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/news_portal
CORS_ORIGIN=http://localhost:3000
```

### 3. Initialize Database

First, create the database manually:

```bash
createdb news_portal
```

Then run the initialization script:

```bash
npm run db:init
```

This will create the `news` table and indexes as defined in `/product_docs/news-portal-database-model.sql`.

### 4. Run the API

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will:
1. Start on `http://localhost:8080`
2. Run initial news ingestion from all RSS sources
3. Schedule cron jobs for automatic updates

## API Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T23:00:00.000Z",
  "version": "1.0.0"
}
```

### Get News by Category (Paginated)

```
GET /api/v1/{category}?page=1&pageSize=10
```

**Categories:** `actualidad`, `politica`, `economia`, `deportes`, `finanzas`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `pageSize` (optional, default: 10, max: 50) - Items per page

**Response:**
```json
{
  "data": [
    {
      "newId": "unique-article-id",
      "portalName": "Q'hubo Cali",
      "newTitle": "Article headline...",
      "newDate": "2026-02-10T20:00:00.000Z",
      "image": "https://example.com/image.jpg",
      "description": "Short summary...",
      "content": "<p>Full HTML content...</p>",
      "category": "actualidad",
      "flag": false
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 150,
  "totalPages": 15
}
```

### Get Top 4 Actualidad News

```
GET /api/v1/actualidad/4
```

Returns the 4 most recent "Actualidad" news items, prioritizing flagged articles.

**Response:**
```json
{
  "data": [
    { /* NewsItem 1 */ },
    { /* NewsItem 2 */ },
    { /* NewsItem 3 */ },
    { /* NewsItem 4 */ }
  ]
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `INVALID_CATEGORY` - Invalid category parameter
- `INVALID_PAGE` - Invalid page number
- `INVALID_PAGE_SIZE` - Invalid page size
- `INTERNAL_ERROR` - Server error

## RSS Sources

| Category   | Source | RSS Feed URL |
|-----------|--------|--------------|
| Actualidad | Q'hubo Cali | https://www.qhubocali.com/feed/ |
| Política | Infobae | https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/ |
| Economía | Valora Analitik | https://www.valoraanalitik.com/feed/ |
| Deportes | Futbolred | https://www.futbolred.com/rss |
| Finanzas | El País | https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a |

## Cron Jobs

Automatic news ingestion runs at:
- 6:00 AM (Colombia time)
- 12:00 PM (Colombia time)
- 6:00 PM (Colombia time)

The system also runs an initial ingestion on startup.

## Architecture

```
src/
├── db/              # Database connection pool
├── middleware/      # Express middleware (validation, errors)
├── routes/          # API route handlers
├── services/        # Business logic (news, ingestion, cron)
├── sources/         # RSS feed parsers for each source
├── utils/           # Helper functions
└── index.ts         # Application entry point
```

## Data Flow

1. **Ingestion:** Cron job triggers → RSS sources fetched → Articles parsed → Duplicates checked → New items inserted
2. **API Request:** Client requests news → Validation → Database query → Response formatting → JSON response
3. **Error Handling:** Error occurs → Error middleware catches → Consistent error format → Logged and returned

## Testing

```bash
# Lint code
npm run lint

# Build TypeScript
npm run build

# Manual testing
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/actualidad?page=1
```

## Deployment

### Vercel

1. Set environment variables in Vercel dashboard
2. Configure build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Traditional Hosting

1. Build the project: `npm run build`
2. Copy `dist/` folder and `node_modules/` to server
3. Set environment variables
4. Run: `node dist/index.js`

## Troubleshooting

**Database connection issues:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists

**RSS feed failures:**
- Feeds have 10-second timeout
- Failed sources are skipped, not blocking others
- Check logs for specific source errors

**No news appearing:**
- Run manual ingestion to test: start the server and check logs
- Verify RSS feeds are accessible
- Check database has data: `SELECT COUNT(*) FROM news;`

## Development Notes

- All identifiers are in English
- TypeScript strict mode enabled
- No secrets in code (use .env)
- Error handling: timeout + skip failed sources
- Deduplication by `newId` extracted from article URLs
