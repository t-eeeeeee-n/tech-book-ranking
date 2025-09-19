// @ts-check
/**
 * ESLint configuration with conditional Nuxt integration
 * Falls back to basic config if .nuxt/eslint.config.mjs doesn't exist
 */
import { existsSync } from 'node:fs'

// Dynamically import Nuxt ESLint config if available
async function createConfig() {
  let withNuxt
  try {
    if (existsSync('./.nuxt/eslint.config.mjs')) {
      const nuxtConfigPath = './.nuxt/eslint.config.mjs'
      const nuxtConfig = await import(nuxtConfigPath)
      withNuxt = nuxtConfig.default
    }
  } catch {
    // Fallback if .nuxt/eslint.config.mjs doesn't exist or fails to import
  }

  return withNuxt ? withNuxt() : [
    {
      files: ['**/*.{js,mjs,ts,vue}'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          // Nuxt globals
          $fetch: 'readonly',
          navigateTo: 'readonly',
          useRoute: 'readonly',
          useRouter: 'readonly',
          useState: 'readonly',
          useFetch: 'readonly',
          useHead: 'readonly',
          definePageMeta: 'readonly',
          defineEventHandler: 'readonly',
          getQuery: 'readonly',
          createError: 'readonly',
          // Vue 3 globals
          defineProps: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          withDefaults: 'readonly',
          // Browser globals
          window: 'readonly',
          document: 'readonly',
          console: 'readonly',
          process: 'readonly'
        }
      },
      rules: {
        'no-unused-vars': 'warn',
        'no-undef': 'error',
        // TypeScript any禁止
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-return': 'error'
      }
    }
  ]
}

export default createConfig()