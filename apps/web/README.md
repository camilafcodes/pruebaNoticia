# La Crónica Nacional - Frontend

Next.js 16 application for the news portal "La Crónica Nacional".

## Features

- **Server-Side Rendering (SSR)** for optimal performance and SEO
- **Responsive Design** with Tailwind CSS
- **Category Pages** for Actualidad, Política, Economía, Deportes, and Finanzas
- **News Detail Pages** with full article content
- **Pagination** for news listings
- **Mobile Navigation** with hamburger menu
- **Loading and Error States** for better UX

## Prerequisites

- Node.js 20+
- Backend API running on `http://localhost:8080` (see `/apps/api/README.md`)

## Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your API URL (default: `http://localhost:8080`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - it will redirect to `/actualidad`.

The page auto-updates as you edit files.

## Build

Build for production:

```bash
npm run build
```

## Production

Start the production server:

```bash
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── [category]/
│   │   ├── [newId]/          # News detail pages
│   │   ├── page.tsx           # Category list pages
│   │   ├── loading.tsx        # Loading state
│   │   └── error.tsx          # Error state
│   ├── layout.tsx             # Root layout with Header, Nav, Footer
│   ├── page.tsx               # Home (redirects to /actualidad)
│   └── globals.css            # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Logo, slogan, date
│   │   ├── Navigation.tsx     # Category navigation
│   │   └── Footer.tsx         # Social links, copyright
│   └── news/
│       ├── NewsCard.tsx       # News item card
│       └── NewsGrid.tsx       # Grid with pagination
└── lib/
    └── api.ts                 # API client utilities
```

## Pages

- `/` - Redirects to `/actualidad`
- `/[category]` - List of news by category (actualidad, politica, economia, deportes, finanzas)
- `/[category]/[newId]` - News detail page

## API Integration

The frontend communicates with the backend API defined in `/docs/api-contract.md`:

- `GET /api/v1/{category}?page=1&pageSize=10` - Paginated news by category
- `GET /api/v1/actualidad/4` - Top 4 actualidad news

All API calls are server-side by default for better SEO and performance.

## Styling

- **Tailwind CSS** for utility-first styling
- Custom prose styles for article content rendering
- Responsive breakpoints: mobile, tablet, desktop

## Notes

- Make sure the backend API is running before starting the frontend
- The backend must have data in the database for news to display
- See `/README.md` (root) for full project setup instructions
