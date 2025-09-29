import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external access (required for Replit)
    port: 5000, // Port 5000 is required for Replit
    strictPort: true,
    allowedHosts: ['49e1a990-de35-449e-83ef-8211dbfd4327-00-3pidl6cfc3eo3.picard.replit.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})