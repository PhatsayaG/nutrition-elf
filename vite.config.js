import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// 這是為了在 ESM 模式下正常解析路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 核心設定：讓 Vite 知道 @ 就是指向 src 資料夾
      "@": path.resolve(__dirname, "./src"),
    },
  },
})