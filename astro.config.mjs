import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.SITE_URL || (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'http://konsultan-lingker.lan');

export default defineConfig({
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()],
  },
});
