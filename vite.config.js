import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The old site's CSS, images and fonts (/themes, /media) stay on the server as they are.
// React's own JS goes to /react-assets so it never clashes with Yii's /assets folder.
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'react-assets',
  },
  server: {
    // during `npm run dev`, load the original CSS/images from the live site
    proxy: {
      '/themes': { target: 'https://chatturai.com', changeOrigin: true },
      '/media': { target: 'https://chatturai.com', changeOrigin: true },
    },
  },
});
