// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://irving-frias.github.io/', // URL completa del sitio
  base: '/irving-frias.github.io/',       // Ruta base con "/" inicial
  integrations: [sitemap(), react()]
});
