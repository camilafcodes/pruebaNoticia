# Architecture Documentation

## Overview
This is a news portal application called "La Crónica Nacional" that aggregates news from multiple RSS feeds and presents them to users in a responsive web interface.

**Slogan:** "Hechos que el poder no puede ocultar"  
**Domain:** lacronicanacional.com  
**Target Platform:** Vercel (primary), with manual deployment artifacts for Hostgator

## Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (as per requirement in product_docs)
- **Data Fetching:** Server-Side Rendering (SSR) + Client Components for interactivity
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Data Ingestion:** RSS feed parsing
- **Cron Jobs:** Scheduled news ingestion (6 AM, 12 PM, 6 PM Colombia time)
- **Deployment:** Vercel

### Database
- **Type:** PostgreSQL
- **Schema:** Single table `news` (see product_docs/news-portal-database-model.sql)
- **Columns:** newId (PK), portalName, newTitle, newDate, image, description, content, category, flag

### Shared
- **Package:** @app/shared
- **Purpose:** Type definitions shared between FE and BE

## Monorepo Structure
```
/product_docs     # Product specification (source of truth)
/apps/web         # Next.js frontend
/apps/api         # Node.js Express backend
/packages/shared  # Shared TypeScript types
/docs             # Architecture, API contract, tasks
```

## Key Architectural Decisions

### 1. Data Persistence Strategy
**Decision:** Use PostgreSQL database as specified in product documentation.

**Implementation Details:**
- Database connection using `pg` (node-postgres) library
- Single table `news` with specified columns
- Deduplication by `newId` (extracted from article URL)

**Pending Decisions:**
- [ ] Database hosting (Vercel Postgres, Supabase, or separate instance?)
- [ ] Connection pool configuration
- [ ] Migration strategy

### 2. RSS Feed Ingestion
**Sources by Category:**
| Category   | RSS Feed URL |
|-----------|-------------|
| Política   | https://www.infobae.com/arc/outboundfeeds/rss/category/colombia/ |
| Actualidad | https://www.qhubocali.com/feed/ |
| Economía   | https://www.valoraanalitik.com/feed/ |
| Deportes   | https://www.futbolred.com/rss |
| Finanzas   | https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/tag/finanzas_a |

**Ingestion Process:**
1. CronJob runs at 6 AM, 12 PM, 6 PM (Colombia timezone)
2. Parse RSS/XML for each category
3. Extract `newId` from article URL using regex pattern
4. Check if `newId` exists in database
5. If new, construct news object and insert into database
6. Handle failures gracefully (skip failed sources, continue with others)

**Error Handling:**
- Timeout for each feed request (5-10 seconds)
- Skip failed feeds without interrupting overall flow
- Log errors for monitoring

### 3. Custom News Import
**Requirement:** Manual news upload capability via JSON files

**Implementation:**
- Directory: `apps/api/customNews/news/` (JSON files)
- Directory: `apps/api/customNews/images/` (image assets)
- Process: On application startup (similar to Spring Boot CommandLineRunner), read JSON, update `newDate`, insert to database

### 4. Caching Strategy
**Initial approach:** No caching layer (read directly from database)

**Future considerations:**
- [ ] Add Redis cache for frequently accessed categories
- [ ] Implement cache invalidation on new ingestion

### 5. Frontend Data Flow
**List View:**
- Fetch paginated news by category (10 items per page)
- Display card grid with: portalName, newTitle, newDate, image, description

**Detail View:**
- Use in-memory data from list view (no additional API call)
- Render `content` field (HTML string) using `dangerouslySetInnerHTML`
- Below detail, show 4 most recent "Actualidad" news items

**Responsive Design:**
- Desktop: 70% main content + 30% sidebar (weather, exchange rates, sports)
- Mobile/Tablet: 100% width, components stacked vertically

### 6. Additional Features (Sidebar - "hijo" component)
**Content:**
- Weather for major Colombian cities (Bogotá, Cali, Medellín, Bucaramanga, Cartagena)
- Currency exchange rates
- Stock market info
- Oil prices
- Football results (European and Colombian leagues)

**Decision:** These features are planned but NOT part of MVP.

**Pending Decisions:**
- [ ] Which APIs to use for weather, exchange rates, sports?
- [ ] Caching strategy for external API data?
- [ ] Update frequency?

## API Structure
See `/docs/api-contract.md` for detailed endpoint specifications.

**Endpoints:**
- `GET /health` - Health check
- `GET /api/v1/actualidad?page=1` - Actualidad news (paginated)
- `GET /api/v1/politica?page=1` - Política news (paginated)
- `GET /api/v1/economia?page=1` - Economía news (paginated)
- `GET /api/v1/deportes?page=1` - Deportes news (paginated)
- `GET /api/v1/finanzas?page=1` - Finanzas news (paginated)
- `GET /api/v1/actualidad/4` - 4 most recent Actualidad news (prioritize flag=true)

## Environment Variables

### Backend (apps/api)
```
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/news_portal
```

### Frontend (apps/web)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment
**Target:** Vercel (FE + BE)

**Alternative:** Generate artifacts for Hostgator dedicated hosting

**Pending Decisions:**
- [ ] Database hosting solution
- [ ] Cron job implementation on Vercel (Vercel Cron vs external service)
- [ ] Environment variables setup in Vercel

## Quality Gates
- TypeScript strict mode enabled
- ESLint + Prettier configured
- All identifiers in English
- No secrets in code
- Consistent error handling

## Open Questions / Decisions Needed
1. **Database Hosting:** Where should the PostgreSQL database be hosted?
2. **Cron Implementation:** Use Vercel Cron (limits apply) or external service?
3. **Sidebar APIs:** Which external APIs for weather, exchange, sports data?
4. **Image Storage:** Where to store custom news images (Vercel blob, S3, CDN)?
5. **Authentication:** Is admin interface needed for custom news upload?
