# Handleliste - Shopping List App

## Overview
A Norwegian shopping list application built with React and Vite. Users can add items to their shopping list, mark them as purchased, and the list persists using localStorage.

## Project Architecture
- **Frontend**: React 18 with Vite as the build tool
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: Browser localStorage
- **Language**: Norwegian interface

## Key Features
- Add new shopping items
- Toggle items as bought/unbought with visual strikethrough
- Persistent storage using localStorage
- Simple, clean interface

## Development Setup
- **Build System**: Vite
- **Package Manager**: npm
- **Development Port**: 5000 (configured for Replit)
- **Host Configuration**: 0.0.0.0 (allows Replit proxy)

## Recent Changes
- Configured Vite to work with Replit's proxy system
- Updated server configuration to bind to 0.0.0.0:5000
- Set up development workflow
- Configured deployment for autoscale production environment

## File Structure
```
├── src/
│   ├── App.jsx       # Main application component
│   └── main.jsx      # React entry point
├── index.html        # HTML template
├── package.json      # Dependencies and scripts
├── vite.config.js    # Vite configuration
└── replit.md         # Project documentation
```

## Dependencies
- React 18.2.0
- React DOM 18.2.0
- Vite 5.2.0
- ESLint for code quality

## Deployment
Configured for Replit's autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run preview`
- Target: Stateless web application