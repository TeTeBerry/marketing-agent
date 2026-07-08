import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  envDir: path.resolve(__dirname, '..'),
  envPrefix: ['VITE_', 'BACKEND_', 'INTERNAL_'],
  server: {
    port: 5174,
  },
});
