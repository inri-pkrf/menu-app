import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' => works on any GitHub Pages repo path
export default defineConfig({ plugins: [react()], base: './' })
