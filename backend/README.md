# TechBook Ranking Backend

Express.js + TypeScript + MongoDB backend API for the TechBook Ranking service.

## Features

- **RESTful API** with TypeScript
- **MongoDB** with Mongoose ODM
- **Express.js** with comprehensive middleware stack
- **Input validation** with Joi
- **Error handling** with proper HTTP status codes
- **Rate limiting** and security headers
- **CORS** support for frontend integration
- **Health check** endpoint

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/         # Mongoose models
├── routes/         # API route definitions  
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

3. **Start MongoDB** (make sure MongoDB is running locally or provide remote URI)

4. **Development mode:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Books

- `GET /api/books` - Get paginated book list with filtering
  - Query params: `page`, `limit`, `category`, `search`, `period`, `sort`
  - Returns: `BooksListApiResponse`

- `GET /api/books/:id` - Get specific book by ID
  - Returns: `BookApiResponse`

### Health Check

- `GET /health` - Server health status

## Environment Variables

```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/techbook-ranking
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## API Response Format

All API responses follow this structure:

```typescript
interface BooksListApiResponse {
  success: boolean
  data: Book[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
    hasNext: boolean
    hasPrev: boolean
  }
  meta: {
    totalBooks: number
    filteredCount: number
    categories?: CategoryStats[]
    searchQuery?: string
    appliedFilters: BookFilters
  }
}
```