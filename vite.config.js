import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { projects } from './src/data/projects.js';
import { pages } from './src/data/pages.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prerenderedRoutes = new Set([...pages.filter(page=>page.path!=='/').map(page=>page.path),...projects.map(project => `/projects/${project.slug}`)]);
export default defineConfig({plugins: [react(), {
  name: 'prerendered-preview-routes',
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      const url = new URL(request.url, 'http://localhost');
      const pathname = url.pathname.replace(/\/$/, '');
      if (prerenderedRoutes.has(pathname)) request.url = `${pathname}/index.html${url.search}`;
      else if (pathname && !pathname.includes('.')) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve(server.config.root, server.config.build.outDir, '404.html')));
        return;
      }
      next();
    });
  },
}], build: {outDir: 'dist'}, server: {port: 5173, strictPort: true}});
