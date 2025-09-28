import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true, // Allows external access
    cors: {
      origin: [
        "https://49e1a990-de35-449e-83ef-8211dbfd4327-00-3pidl6cfc3eo3.picard.replit.dev"
      ]
    }
  }
})
