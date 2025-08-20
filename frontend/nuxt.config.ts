export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  modules: [
    // '@nuxt/fonts', // Temporarily disabled due to dependency issues
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
      },
      hmr: {
        port: 3001
      }
    },
    optimizeDeps: {
      include: ['vue', '@vue/runtime-core']
    }
  },
  // ESM設定の修正
  experimental: {
    payloadExtraction: false
  },
  // Vue設定でワーニングを抑制
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes('-')
    }
  },
  // Router設定でDevTools関連の警告を抑制
  router: {
    options: {
      strict: false
    }
  },
  // サーバー設定でDevTools関連のリクエストを処理
  serverHandlers: [
    {
      route: '/.well-known/**',
      handler: '~/server/api/well-known.ts'
    }
  ],
  // Runtime config for API keys and backend URL
  runtimeConfig: {
    // Private keys (only available on server-side)
    private: {
      backendApiKey: process.env.BACKEND_API_KEY || 'dev-api-key-2024'
    },
    // Public keys (exposed to client-side)
    public: {
      apiKey: process.env.NUXT_PUBLIC_API_KEY || 'dev-api-key-2024',
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    }
  }
})