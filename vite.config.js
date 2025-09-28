import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    host: '0.0.0.0', // Allows external access (required for Replit)
    port: 5000, // Port 5000 is required for Replit
    strictPort: true
=======
    port: 5173,
    open: true,
    host: true, // Allows external access
    cors: {
      origin: [
        "https://49e1a990-de35-449e-83ef-8211dbfd4327-00-3pidl6cfc3eo3.picard.replit.dev"
      ]
    }
>>>>>>> 0454b24393d8f6134c301b489c84319bb0e9d269
  }
})
