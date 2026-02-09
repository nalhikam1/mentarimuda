import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mentarimuda.com',
  base: '/',
  integrations: [svelte(), sitemap()],
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    build: {
      // Inline CSS yang kecil untuk mengurangi blocking requests
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // Inline assets < 4KB
      rollupOptions: {
        output: {
          // Optimasi chunking untuk mengurangi critical path
          manualChunks: undefined,
        },
      },
    },
    css: {
      // Minify CSS untuk mengurangi transfer size
      devSourcemap: false,
    },
  },
});