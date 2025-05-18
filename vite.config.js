import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      // ONLY proxy backend API and gradio endpoints, NOT the root path!
      '/api': 'http://localhost:8000',
      // If your gradio chatbots are at e.g. `/health-hunch-chat/`, list them here:
      // '/health-hunch-chat': 'http://localhost:8000',
      // '/etf-navigator-chat': 'http://localhost:8000',
      // ...etc
    }
  }
});
