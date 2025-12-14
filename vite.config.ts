import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/Translations-Annotation-Tool-Interface/',  // GitHub Pages subdirectory
  build: {
    target: 'esnext',
    outDir: 'dist',  // Standard Vite output directory
  },
  server: {
    port: 3000,
    open: true,
  },
});
