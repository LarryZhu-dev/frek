import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import thanos from './scrips/thanos.js';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'thanos',
      configureServer(server) {
        thanos();
      },
    }
  ],
})
