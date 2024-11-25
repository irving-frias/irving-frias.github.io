// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // URL completa del sitio
  site: 'https://irving-frias.github.io/',

  integrations: [sitemap(), react()],
  experimental: { contentLayer: true }
});