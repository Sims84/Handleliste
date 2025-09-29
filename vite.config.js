// vite.config.js
import { defineConfig } from 'vite'
// If you use React plugin, uncomment next two lines:
// import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: [react()],
  server: {
    host: true,                 // listen externally (Replit/containers)
    allowedHosts: [
      /.+\.replit\.dev$/,
      /.+\.repl\.co$/,
    ],
    hmr: { clientPort: 443 },   // HMR through HTTPS proxy
  },
})