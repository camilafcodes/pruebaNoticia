# API Contract

## Base URL
- **Development:** `http://localhost:8080`
- **Production:** TBD (Vercel deployment)

## Common Response Formats

### Success Response
All successful responses return JSON with appropriate HTTP status codes (200, 201, etc.)

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `INVALID_CATEGORY` - Invalid category provided
- `INVALID_PAGE` - Invalid page number
- `INTERNAL_ERROR` - Server error
- `NOT_FOUND` - Resource not found

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check API health status

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T22:50:00.000Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200` - Service is healthy

---

### 2. Get News by Category (Paginated)

**Endpoints:**
- `GET /api/v1/actualidad?page=1&pageSize=10`
- `GET /api/v1/politica?page=1&pageSize=10`
- `GET /api/v1/economia?page=1&pageSize=10`
- `GET /api/v1/deportes?page=1&pageSize=10`
- `GET /api/v1/finanzas?page=1&pageSize=10`

**Description:** Get paginated news for a specific category, ordered by `newDate` descending

**Query Parameters:**
- `page` (optional, default: 1) - Page number (1-indexed)
- `pageSize` (optional, default: 10) - Items per page

**Response:**
```json
{
  "data": [
    {
      "newId": "el-banco-sabadell-cierra-las-cuentas-de-2025",
      "portalName": "El País",
      "newTitle": "El Banco Sabadell cierra las cuentas de 2025...",
      "newDate": "2026-02-06T10:30:00.000Z",
      "image": "https://example.com/image.jpg",
      "description": "Short description of the article...",
      "content": "<p>Full HTML content of the article...</p>",
      "category": "finanzas",
      "flag": false
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 150,
  "totalPages": 15
}
```

**Field Descriptions:**
- `newId` - Unique identifier extracted from article URL
- `portalName` - Source portal name (e.g., "Infobae", "El País")
- `newTitle` - Article headline
- `newDate` - Publication/update date (ISO 8601)
- `image` - Article image URL (optional)
- `description` - Short article summary (optional)
- `content` - Full HTML content of article
- `category` - Category: "actualidad", "politica", "economia", "deportes", "finanzas"
- `flag` - Boolean flag (true = featured/priority)

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters
- `500` - Internal server error

**Error Example:**
```json
{
  "error": {
    "code": "INVALID_PAGE",
    "message": "Page number must be a positive integer",
    "details": { "page": "-1" }
  }
}
```

---

### 3. Get Top 4 Actualidad News

**Endpoint:** `GET /api/v1/actualidad/4`

**Description:** Get the 4 most recent news items from "Actualidad" category with priority logic

**Priority Logic:**
1. **Priority 1:** News with `flag = true` AND `category = 'actualidad'`, ordered by `newDate` DESC
2. **Priority 2:** News with `category = 'actualidad'`, ordered by `newDate` DESC

**Response:**
```json
{
  "data": [
    {
      "newId": "noticia-destacada-1",
      "portalName": "QHubo Cali",
      "newTitle": "Breaking news headline...",
      "newDate": "2026-02-10T20:00:00.000Z",
      "image": "https://example.com/image1.jpg",
      "description": "Brief description...",
      "content": "<p>Full content...</p>",
      "category": "actualidad",
      "flag": true
    },
    {
      "newId": "noticia-reciente-2",
      "portalName": "QHubo Cali",
      "newTitle": "Recent news headline...",
      "newDate": "2026-02-10T18:30:00.000Z",
      "image": "https://example.com/image2.jpg",
      "description": "Brief description...",
      "content": "<p>Full content...</p>",
      "category": "actualidad",
      "flag": false
    }
  ]
}
```

**Note:** Response always returns exactly 4 items (or fewer if database has less than 4 actualidad news)

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

## Data Validation Rules

### Category
- **Valid values:** "actualidad", "politica", "economia", "deportes", "finanzas"
- **Case:** Lowercase
- **Error:** Return `INVALID_CATEGORY` error if invalid

### Page Number
- **Type:** Integer
- **Min:** 1
- **Error:** Return `INVALID_PAGE` if less than 1 or not a number

### Page Size
- **Type:** Integer
- **Min:** 1
- **Max:** 50 (to prevent excessive load)
- **Default:** 10
- **Error:** Return `INVALID_PAGE_SIZE` if out of range

---

## Backend Implementation Notes

### Database Query Examples

**Get paginated news:**
```sql
SELECT * FROM news
WHERE category = 'finanzas'
ORDER BY "newDate" DESC
LIMIT 10 OFFSET 0;
```

**Get top 4 actualidad (with priority):**
```sql
(
  SELECT * FROM news
  WHERE category = 'actualidad' AND flag = true
  ORDER BY "newDate" DESC
  LIMIT 4
)
UNION ALL
(
  SELECT * FROM news
  WHERE category = 'actualidad'
  ORDER BY "newDate" DESC
  LIMIT 4
)
ORDER BY flag DESC, "newDate" DESC
LIMIT 4;
```

### Content Field
The `content` field contains HTML as a string. This HTML is generated from the RSS feed's content/description field and may include:
- `<p>`, `<div>`, `<img>`, `<a>` tags
- Inline styles
- External links

**Frontend Responsibility:** Sanitize and render safely using `dangerouslySetInnerHTML` or a sanitization library.

---

## CORS Configuration
The API must allow CORS from the frontend domain:
- **Development:** `http://localhost:3000`
- **Production:** `https://lacronicanacional.com` (or Vercel domain)

---

## Rate Limiting (Future)
Not implemented in MVP. Consider adding rate limiting for production:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Caching Headers (Future)
Consider adding cache headers for better performance:
```
Cache-Control: public, max-age=300
```
(5 minutes cache for news endpoints)
