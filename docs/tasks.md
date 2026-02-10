# Task Breakdown

## Phase 1: Infrastructure & Setup ✅
- [x] Bootstrap monorepo structure
- [x] Create root package.json with workspaces
- [x] Set up packages/shared with TypeScript types
- [x] Initialize apps/api (Express + TypeScript)
- [x] Initialize apps/web (Next.js + TypeScript + Tailwind)
- [x] Generate documentation (/docs/)

## Phase 2: Backend Implementation 🔄

### Database Setup
- [ ] Install `pg` (node-postgres) library
- [ ] Create database connection module
- [ ] Implement connection pool configuration
- [ ] Add environment variable for `DATABASE_URL`
- [ ] Create initialization script to run SQL schema

### RSS Feed Ingestion
- [ ] Install RSS parser library (`rss-parser` or `fast-xml-parser`)
- [ ] Create `sources/` directory structure
- [ ] Implement RSS parsers for each source:
  - [ ] Infobae (Política)
  - [ ] QHubo Cali (Actualidad)
  - [ ] Valora Analitik (Economía)
  - [ ] Futbolred (Deportes)
  - [ ] El País (Finanzas)
- [ ] Implement `newId` extraction from URL (regex pattern)
- [ ] Create deduplication logic (check if `newId` exists)
- [ ] Implement error handling (timeout, skip failed sources)
- [ ] Add environment variables for RSS feed URLs

### Cron Job Implementation
- [ ] Install cron library (`node-cron`)
- [ ] Create cron job service
- [ ] Schedule jobs: 6 AM, 12 PM, 6 PM Colombia time (UTC-5)
- [ ] Implement flag update logic (update `newDate` for flag=true actualidad news)
- [ ] Add logging for cron execution

### Custom News Import
- [ ] Create `customNews/news/` directory
- [ ] Create `customNews/images/` directory
- [ ] Implement startup hook (similar to CommandLineRunner)
- [ ] Parse custom JSON file
- [ ] Map to database schema
- [ ] Insert custom news on startup

### API Endpoints
- [x] `GET /health` (basic implementation done)
- [ ] `GET /api/v1/actualidad?page=1&pageSize=10`
- [ ] `GET /api/v1/politica?page=1&pageSize=10`
- [ ] `GET /api/v1/economia?page=1&pageSize=10`
- [ ] `GET /api/v1/deportes?page=1&pageSize=10`
- [ ] `GET /api/v1/finanzas?page=1&pageSize=10`
- [ ] `GET /api/v1/actualidad/4`
- [ ] Implement pagination logic
- [ ] Implement input validation
- [ ] Add error handling middleware
- [ ] Add request logging

### Testing & Quality
- [ ] Add basic integration tests
- [ ] Test RSS parsing for all sources
- [ ] Test database operations
- [ ] Test API endpoints
- [ ] Run `npm run lint` and fix issues
- [ ] Run `npm run build` and verify

## Phase 3: Frontend Implementation 🔄

### Layout Components
- [ ] Create `Header` component
  - [ ] Logo
  - [ ] Slogan
  - [ ] Current date display
  - [ ] Responsive design (vertical stack on mobile)
- [ ] Create `Navigation` component
  - [ ] Horizontal menu with 5 categories
  - [ ] Hamburger menu for mobile/tablet
  - [ ] Active state styling
- [ ] Create `Footer` component
  - [ ] Logo
  - [ ] Social media links (Facebook, LinkedIn, Twitter)
  - [ ] Copyright 2026
  - [ ] Domain name
  - [ ] Responsive design

### News Display Components
- [ ] Create `NewsCard` component
  - [ ] Display: portalName, newTitle, newDate, image, description
  - [ ] Click handler to navigate to detail
- [ ] Create `NewsGrid` component
  - [ ] Grid layout (responsive)
  - [ ] Pagination controls
  - [ ] Loading state
  - [ ] Empty state
  - [ ] Error state
- [ ] Create `NewsDetail` component
  - [ ] Render full article content (HTML)
  - [ ] Display below: 4 recent actualidad news
  - [ ] Responsive: 70% width on desktop, 100% on mobile

### Sidebar Component ("hijo")
- [ ] Create `Sidebar` component structure
- [ ] Weather widget (Colombian cities)
  - [ ] **Decision needed:** Which weather API?
- [ ] Currency exchange widget
  - [ ] **Decision needed:** Which exchange rate API?
- [ ] Stock market info
  - [ ] **Decision needed:** Which financial API?
- [ ] Football results
  - [ ] **Decision needed:** Which sports API?
- [ ] Responsive: hide on mobile, show on desktop

### Pages (App Router)
- [ ] `app/page.tsx` - Home page (default: Actualidad category)
- [ ] `app/[category]/page.tsx` - Category list page
- [ ] `app/[category]/[newId]/page.tsx` - News detail page
- [ ] Add SEO metadata to each page
- [ ] Implement loading.tsx for each page
- [ ] Implement error.tsx for each page

### API Integration
- [ ] Create API client utility (`lib/api.ts`)
- [ ] Implement `fetchNewsByCategory(category, page)`
- [ ] Implement `fetchTop4Actualidad()`
- [ ] Add error handling and retry logic
- [ ] Add loading states
- [ ] Implement client-side navigation

### Styling
- [x] Tailwind CSS configured
- [ ] Define color scheme
- [ ] Define typography styles
- [ ] Implement responsive breakpoints
- [ ] Add dark mode support (optional)

### Testing & Quality
- [ ] Test all pages render correctly
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test navigation between pages
- [ ] Test API error handling
- [ ] Run `npm run lint` and fix issues
- [ ] Run `npm run build` and verify

## Phase 4: Integration & Deployment 🔄

### Local Testing
- [ ] Run backend: `npm run dev --workspace=apps/api`
- [ ] Run frontend: `npm run dev --workspace=apps/web`
- [ ] Verify frontend can fetch data from backend
- [ ] Test end-to-end flow: home -> category -> detail
- [ ] Test all 5 categories
- [ ] Test pagination
- [ ] Test responsive design

### Deployment Preparation
- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Set up PostgreSQL database (Vercel Postgres or external)
- [ ] Run database migrations
- [ ] Configure Vercel Cron jobs (if supported)
- [ ] Test deployment in preview environment

### Production Deployment
- [ ] Deploy to Vercel
- [ ] Verify all endpoints work in production
- [ ] Test with real RSS feeds
- [ ] Monitor error logs
- [ ] Set up custom domain (lacronicanacional.com)

### Alternative Hosting (Hostgator)
- [ ] Generate build artifacts for static hosting
- [ ] Document manual deployment process
- [ ] Create deployment scripts

## Phase 5: Post-MVP Enhancements (Future)

### Nice-to-Have Features
- [ ] Admin panel for custom news upload
- [ ] Search functionality
- [ ] Social sharing buttons
- [ ] Comments system
- [ ] Newsletter subscription
- [ ] Push notifications
- [ ] Performance optimization (caching, CDN)
- [ ] Analytics integration

### Open Questions
- [ ] Database hosting solution
- [ ] Cron job implementation (Vercel Cron vs external)
- [ ] External APIs for sidebar widgets (weather, exchange, sports)
- [ ] Image storage solution
- [ ] Authentication for admin features

---

## Current Status
**Phase 1:** ✅ Complete  
**Phase 2:** 🔄 In Progress (10% - basic API structure ready)  
**Phase 3:** 🔄 Not Started  
**Phase 4:** 🔄 Not Started  
**Phase 5:** 📋 Planned  

## Next Steps
1. Set up PostgreSQL database connection
2. Implement RSS feed parsing for at least one source
3. Create basic API endpoint for one category
4. Test end-to-end flow
