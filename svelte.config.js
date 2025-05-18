import adapter from '@sveltejs/adapter-static';
export default {
  kit: {
    adapter: adapter({
      // where to output
      pages: 'build',
      assets: 'build',
      // serves index.html for any 404 (SPA fallback)
      fallback: 'index.html'
    }),
    paths: {
      // if serving at root, leave these blank
      base: '',
      assets: ''
    }
  }
};
