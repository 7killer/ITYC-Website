import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { toolEntriesPlugin } from './build/toolEntries.ts'

export default defineConfig({
  plugins: [react(), toolEntriesPlugin()],
  build: {
    assetsDir: 'assets',
    manifest: true,
    sourcemap: false,
  },
  server: {
    host: true,
  },
})

