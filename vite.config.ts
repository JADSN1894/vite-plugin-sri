import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import subresourceIntegrity from "./plugin-sri";

export default defineConfig({
  server: {
    port: 8000,
    strictPort: true,
    host: true
  },
  plugins: [
    svelte(),
    subresourceIntegrity(),
  ],
})
