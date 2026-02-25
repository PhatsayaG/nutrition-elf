import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // 新增這一行，確保 Vite 找不到時會嘗試這些副檔名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
})