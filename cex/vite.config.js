import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const BASE_URL = process.env.NODE_ENV === 'production' ? '/web/' : '/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: BASE_URL,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    host: '::',
    port: 12000,
    allowedHosts: true,
    cors: true,
    open: BASE_URL,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
