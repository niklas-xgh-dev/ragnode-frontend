import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      // bots list + any other endpoints
      '/api': 'http://localhost:8000',
      // each bot’s Gradio mount (e.g. /gpt4all/, /mybot/, etc.)
      // you can proxy all /<bot>/ to the same backend
      '/': {
        target: 'http://localhost:8000',
        // but we’ll let SvelteKit handle static (`/static`) and API explicitly
        // so only passthrough unknown routes if they match a bot path
      }
    }
  }
});
