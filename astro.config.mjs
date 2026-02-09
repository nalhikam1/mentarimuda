import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://mentarimuda.com',
  base: '/',
  integrations: [svelte(), sitemap()],
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});