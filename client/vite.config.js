import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/search': 'http://localhost:3000',
      '/confirm': 'http://localhost:3000',
      '/cancel': 'http://localhost:3000',
      '/settings/paths': 'http://localhost:3000',
    }
  }
})
