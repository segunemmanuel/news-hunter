import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/gnews': {
        target: 'https://gnews.io',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/gnews/, '')
      },
      '/api/newsapi': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/newsapi/, '')
      }
    }
  }
})
