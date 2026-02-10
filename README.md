# La Crónica Nacional - News Portal

**Slogan:** "Hechos que el poder no puede ocultar"

A news aggregation portal that collects and displays news from multiple RSS feeds across categories: Actualidad, Política, Economía, Deportes, and Finanzas.

## Project Structure

This is a monorepo containing:
- **apps/web** - Next.js frontend (TypeScript + Tailwind CSS)
- **apps/api** - Node.js Express backend (TypeScript)
- **packages/shared** - Shared TypeScript types
- **docs/** - Architecture, API contract, and task documentation

## Prerequisites

- Node.js 20+ 
- npm 9+
- PostgreSQL 14+ (for backend)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (root, apps/web, apps/api, packages/shared).

### 2. Set Up Environment Variables

**Backend (.env file in apps/api/):**
```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and add your DATABASE_URL
```

Example `.env`:
```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/news_portal
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local file in apps/web/):**
```bash
cp apps/web/.env.example apps/web/.env.local
# Default API URL is already set to http://localhost:8080
```

### 3. Initialize Database

Create the PostgreSQL database:
```bash
createdb news_portal
```

Run the initialization script:
```bash
npm run db:init --workspace=apps/api
```

This creates the `news` table and indexes.

### 4. Run Development Servers

**Option A: Run both frontend and backend simultaneously**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run dev --workspace=apps/api
```

Terminal 2 (Frontend):
```bash
npm run dev --workspace=apps/web
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/health

## Available Commands

### Root Level

```bash
npm run dev      # Run both apps in development mode
npm run build    # Build all apps
npm run lint     # Lint all apps
npm run test     # Run tests for all apps
```

### Backend (apps/api)

```bash
npm run dev --workspace=apps/api      # Start dev server with hot reload
npm run build --workspace=apps/api    # Build TypeScript to dist/
npm run start --workspace=apps/api    # Start production server
npm run lint --workspace=apps/api     # Run ESLint
npm run db:init --workspace=apps/api  # Initialize database schema
```

### Frontend (apps/web)

```bash
npm run dev --workspace=apps/web      # Start Next.js dev server
npm run build --workspace=apps/web    # Build for production
npm run start --workspace=apps/web    # Start production server
npm run lint --workspace=apps/web     # Run ESLint
```

## Documentation

- **[Architecture](docs/architecture.md)** - System architecture and technical decisions
- **[API Contract](docs/api-contract.md)** - Complete API specification
- **[Tasks](docs/tasks.md)** - Development task breakdown and progress

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Deployment:** Vercel
- **Monorepo:** npm workspaces

## Features

### Current (MVP)
- RSS feed aggregation from multiple news sources
- News categorization (Actualidad, Política, Economía, Deportes, Finanzas)
- Paginated news listings
- Detailed news view with full HTML content
- Responsive design (desktop, tablet, mobile)
- Scheduled news ingestion (cron jobs)

### Planned
- Weather widget
- Currency exchange rates
- Sports results
- Custom news upload
- Search functionality
- Social sharing

## Contributing

This project follows these conventions:
- All code in English
- TypeScript strict mode
- ESLint + Prettier for code formatting
- Conventional commits

## License

[Add license information here]

## Contact

Domain: lacronicanacional.com
