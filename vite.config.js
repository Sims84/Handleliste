import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external access (required for Replit)
    port: 5000, // Port 5000 is required for Replit
    strictPort: true
  }
})