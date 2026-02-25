import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// 確保在 ESM 環境下正確解析路徑
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 這一行是靈魂：告訴 Vite 看到 @ 就去 src 找
      "@": path.resolve(__dirname, "./src"),
    },
  },
})