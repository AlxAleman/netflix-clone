import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      config: {
        content: [
          './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
          './public/**/*.html'
        ],
      }
    })
  ],
  output: 'static',
});