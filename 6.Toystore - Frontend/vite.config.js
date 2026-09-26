import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['pi'],
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});