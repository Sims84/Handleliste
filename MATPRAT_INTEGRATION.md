# 🔍 Matprat.no Integration - Quick Start

## What I Built For You

Your Handleliste app now integrates with **Matprat.no** - Norway's largest recipe website!

### New Features:

✅ **Search Matprat.no** directly from your app  
✅ **One-click import** of recipes with all ingredients  
✅ **Automatic ingredient extraction** to shopping list  
✅ **Database storage** (recipes saved in PostgreSQL, not localStorage)  
✅ **Delete recipes** functionality  
✅ **Source links** to view original recipes  

---

## How to Get Started

### 1. Create `.env` File

Copy `env.example.txt` and rename it to `.env`, then fill in your values:

```bash
DATABASE_URL=your_postgresql_connection_string
REPLIT_DOMAINS=localhost:5000
REPL_ID=local-dev
SESSION_SECRET=any-random-string-here
```

**Note:** The app won't start without these environment variables!

### 2. Setup Database

```bash
npm run db:push
```

This creates the new `recipes` table.

### 3. Start the App

```bash
npm run dev
```

---

## Using the New Feature

### In the App:

1. Navigate to the **Oppskrifter** (Recipes) section
2. Click **"🔍 Søk på Matprat.no"** button
3. Type what you want to cook (e.g., "lasagne", "taco", "kylling")
4. Press Enter or click **Søk**
5. Click **Importer** on any recipe you like
6. Click **→ Handleliste** to add ingredients to your shopping list

---

## Files Changed

### Backend:
- ✅ `shared/schema.ts` - Added recipes table
- ✅ `server/storage.ts` - Recipe CRUD operations
- ✅ `server/routes.ts` - New API endpoints
- ✅ `server/matpratScraper.ts` - **NEW** Scraping logic

### Frontend:
- ✅ `client/src/components/RecipesMenu.jsx` - Enhanced with search UI

---

## API Endpoints Added

```
GET    /api/recipes              - Get all user recipes
POST   /api/recipes              - Create new recipe
DELETE /api/recipes/:id          - Delete a recipe
GET    /api/matprat/search?q=    - Search Matprat.no
POST   /api/matprat/import       - Import recipe from URL
GET    /api/matprat/featured     - Get featured recipes
```

---

## How It Works

```
User searches for "pizza"
       ↓
Frontend calls /api/matprat/search?q=pizza
       ↓
Backend scrapes Matprat.no search results
       ↓
Returns list of recipes with titles & URLs
       ↓
User clicks "Importer"
       ↓
Backend scrapes the full recipe page
       ↓
Extracts: name, ingredients, instructions, image
       ↓
Saves to PostgreSQL database
       ↓
Recipe appears in user's list
```

---

## Troubleshooting

### ❌ "DATABASE_URL must be set"
- Create a `.env` file with your database URL
- Get free PostgreSQL at: [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)

### ❌ "REPLIT_DOMAINS not provided"
- Add all required variables from `env.example.txt`

### ❌ Server fails to start
- This app is designed for Replit (has auth built-in)
- For local dev, you need all environment variables
- Consider removing auth middleware for local testing

### ❌ Search returns no results
- Matprat.no might have changed their API/HTML structure
- Check `server/matpratScraper.ts` and update selectors
- The scraper uses JSON-LD structured data extraction

---

## Next Steps (Optional Improvements)

1. **Add caching** to reduce Matprat requests
2. **Implement rate limiting** to be respectful
3. **Add recipe categories/tags**
4. **Create meal planning calendar**
5. **Add recipe sharing** between users
6. **Contact Matprat** for official API access (if going to production)

---

## Important Notes

⚠️ **Web Scraping Ethics:**
- This is for educational/personal use
- Be respectful of Matprat.no's servers
- Don't make too many requests
- Consider caching results
- For production use, contact Matprat for official API

🎯 **Best Practices:**
- The scraper includes proper User-Agent headers
- Uses structured data (JSON-LD) when available
- Falls back to HTML parsing if needed
- Includes error handling

---

## Demo Flow

```
1. User: "I want to cook pizza"
   └─→ Clicks "Søk på Matprat.no"
   └─→ Types "pizza"
   └─→ Sees: 15 pizza recipes from Matprat

2. User clicks "Importer" on "Perfekt pizza margherita"
   └─→ Recipe imported with 8 ingredients
   └─→ Appears in their recipe list

3. User clicks "→ Handleliste"
   └─→ All 8 ingredients added to shopping list
   └─→ Ready to go shopping!
```

---

## Questions?

Check `SETUP.md` for detailed setup instructions or review the code:
- `server/matpratScraper.ts` - Scraping logic
- `server/routes.ts` - API endpoints
- `client/src/components/RecipesMenu.jsx` - UI implementation

Happy cooking! 🍕🍝🥘

