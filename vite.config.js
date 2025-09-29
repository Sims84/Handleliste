import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = parseInt(process.env.PORT || '', 10) || 5173

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                 // lytte på alle interfaces (trengs i Replit)
    port: PORT,                 // bruk Replit sitt PORT i staden for 5000
    strictPort: false,          // la Vite velje annan port om opptatt
    allowedHosts: true,         // tillat proxya hostar (replit.dev, repl.co, osv.)
    hmr: { clientPort: 443 },   // HMR bak HTTPS-proxy
  },
  // om du nokon gong bruker `vite preview`, treng du dette òg:
  preview: {
    host: true,
    allowedHosts: true,
  },
})