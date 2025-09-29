import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = parseInt(process.env.PORT || '', 10) || 5173

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD:client/vite.config.js
    host: '0.0.0.0', // Allows external access (required for Replit)
    port: 5000, // Port 5000 is required for Replit
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
=======
    host: true,                 // lytte på alle interfaces (trengs i Replit)
    port: PORT,                 // bruk Replit sitt PORT i staden for 5000
    strictPort: false,          // la Vite velje annan port om opptatt
    allowedHosts: true,         // tillat proxya hostar (replit.dev, repl.co, osv.)
    hmr: { clientPort: 443 },   // HMR bak HTTPS-proxy
  },
  // om du nokon gong bruker `vite preview`, treng du dette òg:
  preview: {
    host: true,
    allowedHosts: ["49e1a990-de35-449e-83ef-8211dbfd4327-00-3pidl6cfc3eo3.picard.replit.dev"]
  },
>>>>>>> recipes-feature:vite.config.js
})