import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mentarimuda.com',
  base: '/',
  integrations: [svelte(), sitemap(), mdx()],
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