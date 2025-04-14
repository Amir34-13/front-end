import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "./", // ou "/" si ça ne marche pas
  plugins: [react()],
});
