import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { projects } from './src/data/projects.js';

const prerenderedRoutes = new Set(projects.map(project => `/projects/${project.slug}`));
export default defineConfig({plugins: [react(), tailwindcss(), {
  name: 'prerendered-preview-routes',
  configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      const url = new URL(request.url, 'http://localhost');
      const pathname = url.pathname.replace(/\/$/, '');
      if (prerenderedRoutes.has(pathname)) request.url = `${pathname}/index.html${url.search}`;
      next();
    });
  },
}], build: {outDir: 'dist'}, server: {port: 5173, strictPort: true}});
