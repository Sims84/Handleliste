# Handleliste - Authenticated Shopping List App

## Overview
A Norwegian shopping list application with secure user authentication using Replit Auth. Users can log in with multiple providers (Google, GitHub, X, Apple, email/password), create personalized shopping lists, and have their data securely stored in the cloud.

## Project Architecture
- **Frontend**: React 18 with TypeScript and Vite
- **Backend**: Express.js server with authentication middleware  
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: React Query for server state, React hooks for local state
- **Language**: Norwegian interface

## Key Features
- 🔐 Secure authentication with multiple login providers
- 📝 Add and manage shopping items
- ✅ Toggle items as bought/unbought with visual feedback
- ☁️ Cloud-based data persistence per user
- 🍽️ Recipe integration for meal planning
- 📱 Responsive design for all devices
- 🔒 Protected routes and API endpoints

## Development Setup
- **Frontend Server**: Vite on port 5000 with API proxy
- **Backend Server**: Express.js on port 8000
- **Database**: PostgreSQL with automatic migrations
- **Package Manager**: npm
- **Development Command**: `npm run dev` (runs both servers concurrently)

## Authentication Flow
1. **Landing Page**: Shows welcome message and login button for unauthenticated users
2. **Login**: Redirects to Replit Auth with provider selection
3. **Callback**: Processes authentication and creates user session
4. **Home Page**: Shows personalized shopping list for authenticated users
5. **Logout**: Clears session and redirects to landing page

## Recent Changes (Latest - October 10, 2025)
- ✅ **Added URL-based recipe import** - Users can paste recipe URLs from Matprat.no, godt.no, tine.no
- ✅ Simplified recipe integration - no search needed, just copy/paste URLs
- ✅ Fixed Matprat.no recipe search to work without authentication
- ✅ Updated scraper to fetch featured recipes (Matprat uses JavaScript for search)
- ✅ Created recipes database table with proper ingredient storage
- ✅ Fixed shopping list integration - ingredients now properly added from recipes
- ✅ Added complete Replit Auth integration
- ✅ Restructured project into client/server/shared architecture
- ✅ Set up PostgreSQL database with user and session management
- ✅ Created Express backend with secure authentication middleware
- ✅ Implemented React Query for API communication
- ✅ Built landing page for guest users and authenticated home page
- ✅ Configured concurrent development workflow for frontend + backend
- ✅ Added API proxy configuration for seamless development

## File Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.tsx          # Authenticated user dashboard
│   │   │   ├── Landing.tsx       # Welcome page for guests
│   │   │   ├── RecipesMenu.jsx   # Recipe integration component
│   │   │   └── ShoppingList.jsx  # Shopping list management
│   │   ├── hooks/
│   │   │   └── useAuth.ts        # Authentication state hook
│   │   ├── lib/
│   │   │   ├── authUtils.ts      # Auth utility functions
│   │   │   └── queryClient.ts    # React Query configuration
│   │   ├── App.tsx              # Main app with auth routing
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   └── vite.config.js           # Vite config with API proxy
├── server/
│   ├── index.ts                 # Express server entry point
│   ├── routes.ts                # API routes and middleware
│   ├── replitAuth.ts           # Replit Auth integration
│   ├── storage.ts              # Database operations
│   └── db.ts                   # Database connection
├── shared/
│   └── schema.ts               # Database schema (users, sessions)
├── package.json                # Dependencies and scripts
├── drizzle.config.ts          # Database configuration
└── replit.md                  # Project documentation
```

## Key Dependencies
### Frontend
- React 18.2.0 with TypeScript
- @tanstack/react-query for API state
- Vite for development and building

### Backend  
- Express.js for REST API
- Passport.js with OpenID Client for auth
- Drizzle ORM for database operations
- @neondatabase/serverless for PostgreSQL

### Database
- PostgreSQL with automatic session management
- User profiles with email, name, profile image
- Secure session storage with httpOnly cookies

## Development Commands
- `npm run dev` - Start both frontend and backend servers
- `npm run dev:client` - Start only frontend (port 5000)
- `npm run dev:server` - Start only backend (port 8000)
- `npm run db:push` - Push database schema changes
- `npm run build` - Build for production
- `npm run lint` - Code quality checks

## Environment Variables
The following are automatically configured in Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `REPL_ID` - Replit application ID for OAuth
- `REPLIT_DOMAINS` - Comma-separated domains for auth callbacks
- `SESSION_SECRET` - Secret for session encryption

## Security Features
- 🔒 Secure httpOnly cookies for session management
- 🛡️ Protected API routes with authentication middleware
- 🔄 Automatic token refresh for extended sessions
- 🚪 Proper logout with session cleanup
- 🌐 HTTPS-only cookies in production
- 📡 CSRF protection via trusted domains

## Deployment
Ready for Replit deployment with:
- Autoscale target for stateless operation
- Production-ready security configuration
- Automatic database migrations
- Multi-provider authentication support