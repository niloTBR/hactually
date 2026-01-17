import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/Users/nilo/Dropbox (Personal)/Projects/Hactually/design-system',
    },
  },
})
