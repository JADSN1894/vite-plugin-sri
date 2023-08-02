import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import sri from "../../dist";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), sri()],
})
