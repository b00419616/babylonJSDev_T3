import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/babylonJSDev_T3/',
  server: {
    watch: {
      usePolling: true,
    },
    port: 5173,
    host: true,
  },
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        doc: path.resolve(__dirname, 'doc.html'),
        element01: path.resolve(__dirname, 'element01.html'),
        element02: path.resolve(__dirname, 'element02.html'),
        element03: path.resolve(__dirname, 'element03.html'),
        element04: path.resolve(__dirname, 'element04.html'),
        element05: path.resolve(__dirname, 'element05.html'),
      },
    },
  },
});
