import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { fetchOgImage } from './api/_lib/og'

function apiSheetPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'api-sheet-dev',
    configureServer(server) {
      server.middlewares.use('/api/sheet', async (req, res) => {
        const qs = req.url?.split('?')[1] ?? '';
        const type = new URLSearchParams(qs).get('type');
        const URLS: Record<string, string | undefined> = {
          video: env.VIDEO_SHEET_URL,
          recomendacoes: env.RECOMMENDATIONS_SHEET_URL,
        };
        const sheetUrl = type ? URLS[type] : undefined;
        if (!sheetUrl) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'invalid type' }));
          return;
        }
        try {
          const response = await fetch(sheetUrl);
          const csv = await response.text();
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(csv);
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'fetch failed' }));
        }
      });

      server.middlewares.use('/api/og-image', async (req, res) => {
        const qs = req.url?.split('?')[1] ?? '';
        const url = new URLSearchParams(qs).get('url');
        if (!url) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ imageUrl: null }));
          return;
        }
        try {
          const imageUrl = await fetchOgImage(url);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ imageUrl }));
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ imageUrl: null }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega todas as variáveis do .env (sem prefixo) para o plugin server-side
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiSheetPlugin(env)],
    server: {
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          },
        },
      },
    },
  }
})
