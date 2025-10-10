# Handleliste - Setup Guide

## 🎉 New Feature: Matprat.no Integration!

Your shopping list app now has integrated recipe search from Matprat.no, Norway's leading recipe website!

## What's New

### Backend Changes:
1. **Database Schema** (`shared/schema.ts`)
   - Added `recipes` table to store user recipes
   - Includes: name, ingredients, instructions, source URL, image URL

2. **Matprat Scraper** (`server/matpratScraper.ts`)
   - Search recipes on Matprat.no
   - Scrape recipe details (name, ingredients, instructions)
   - Extract structured data using JSON-LD schema

3. **API Endpoints** (`server/routes.ts`)
   - `GET /api/recipes` - Get user's recipes
   - `POST /api/recipes` - Create new recipe
   - `DELETE /api/recipes/:id` - Delete recipe
   - `GET /api/matprat/search?q=query` - Search Matprat
   - `POST /api/matprat/import` - Import recipe from URL
   - `GET /api/matprat/featured` - Get featured recipes

4. **Storage Layer** (`server/storage.ts`)
   - Recipe CRUD operations integrated with database

### Frontend Changes:
1. **Enhanced RecipesMenu** (`client/src/components/RecipesMenu.jsx`)
   - Toggle between manual entry and Matprat search
   - Search Matprat.no directly from the app
   - Import recipes with one click
   - View recipe source links
   - Delete recipes
   - Recipes now saved to database instead of localStorage

## Setup Instructions

### Prerequisites:
- Node.js installed
- PostgreSQL database (Neon, Supabase, or local)

### Step 1: Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
REPLIT_DOMAINS=localhost:5000
REPL_ID=local-dev
SESSION_SECRET=your-secret-key
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database
```bash
npm run db:push
```

This will create the necessary tables including the new `recipes` table.

### Step 4: Run the App
```bash
npm run dev
```

This starts both the client (port 5000) and server (port 8000).

## How to Use Matprat Integration

1. **Search for Recipes:**
   - Click "🔍 Søk på Matprat.no" button
   - Enter search term (e.g., "pizza", "pasta", "kylling")
   - Click "Søk" or press Enter

2. **Import Recipe:**
   - Click "Importer" on any search result
   - Recipe is automatically saved with ingredients
   - Click "→ Handleliste" to add ingredients to shopping list

3. **View Original Recipe:**
   - Click "📖 Se original oppskrift" to view on Matprat.no

4. **Delete Recipe:**
   - Click 🗑️ button on any saved recipe

## Troubleshooting

### Server Won't Start
**Error:** "DATABASE_URL must be set"
- Create `.env` file with database connection string
- Make sure PostgreSQL is running

**Error:** "REPLIT_DOMAINS not provided"
- Add all required environment variables from `.env.example`

### Matprat Search Not Working
The scraper uses basic web scraping and may need adjustments if Matprat.no changes their:
- Search API endpoints
- HTML structure
- JSON-LD schema

Check `server/matpratScraper.ts` and update selectors if needed.

### Database Issues
If recipes aren't saving:
```bash
# Reset database schema
npm run db:push
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  ┌─────────────────────────────────┐   │
│  │  RecipesMenu Component          │   │
│  │  - Manual entry                 │   │
│  │  - Matprat search UI            │   │
│  │  - Recipe display               │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
┌──────────────▼──────────────────────────┐
│         Backend (Express)               │
│  ┌─────────────────────────────────┐   │
│  │  Routes (/api/recipes)          │   │
│  │  ┌────────────┐  ┌────────────┐ │   │
│  │  │  Storage   │  │  Matprat   │ │   │
│  │  │  Layer     │  │  Scraper   │ │   │
│  │  └─────┬──────┘  └─────┬──────┘ │   │
│  └────────┼───────────────┼────────┘   │
└───────────┼───────────────┼────────────┘
            │               │
       ┌────▼────┐    ┌────▼─────────┐
       │Database │    │ Matprat.no   │
       │(Postgres│    │ (External)   │
       └─────────┘    └──────────────┘
```

## Next Steps / Future Improvements

1. **Better Error Handling**
   - More user-friendly error messages
   - Retry logic for failed scrapes

2. **Caching**
   - Cache search results
   - Rate limiting for Matprat requests

3. **Enhanced Features**
   - Recipe categories/tags
   - Favorite recipes
   - Meal planning calendar
   - Shopping list sharing

4. **Mobile App**
   - Progressive Web App (PWA)
   - Native mobile apps

## Notes

- Matprat scraping is for educational purposes
- Please be respectful of Matprat.no's servers
- Consider contacting Matprat for official API access if using in production
- The scraper implements basic rate limiting and user-agent headers

## Support

For issues or questions, check the code comments or create an issue in the repository.

Happy cooking! 🍽️

