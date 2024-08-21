import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to Django backend
      '/api': {
        target: 'http://127.0.0.1:8000', // Django backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});