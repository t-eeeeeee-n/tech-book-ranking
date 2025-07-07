export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },
  // WSL/Windows権限問題の回避
  nitro: {
    storage: {
      fs: {
        driver: 'memory'
      }
    },
    experimental: {
      wasm: true
    }
  },
  // 開発時のパフォーマンス向上とWSL対応
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      fs: {
        strict: false,
        allow: ['..']
      },
      watch: {
        usePolling: true
      }
    },
    optimizeDeps: {
      include: ['vue', '@vue/runtime-core']
    }
  },
  // ESM設定の修正
  experimental: {
    payloadExtraction: false
  }
})