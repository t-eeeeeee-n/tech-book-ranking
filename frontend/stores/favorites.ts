import { defineStore } from 'pinia'
import type { Book } from '~/types'
import { useUserSession } from '~/composables/useUserSession'

export interface FavoriteBook {
  id: number
  title: string
  author: string
  imageUrl?: string
  category: string
  mentionCount: number
  goodBookScore?: number
  addedAt: string
}

interface ApiFavoriteResponse {
  success: boolean
  data: {
    _id: string
    userId: string
    bookId: string
    createdAt: string
    book: {
      id: string
      title: string
      author: string[]
      imageUrl?: string
      category: string[]
      mentionCount: number
      goodBookScore?: number
    }
  }[]
  total: number
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteBooks = ref<FavoriteBook[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ユーザーセッション取得
  const { getUserId } = useUserSession()

  // お気に入りに追加
  const addToFavorites = async (book: Book) => {
    if (!book.id) return // idが存在しない場合は早期リターン

    const existingIndex = favoriteBooks.value.findIndex(fav => fav.id === book.id)
    if (existingIndex !== -1) return // 既に追加済み

    loading.value = true
    error.value = null

    try {
      const userId = getUserId()

      // APIにお気に入り追加リクエスト
      await $fetch('/api/favorites', {
        method: 'POST',
        body: {
          userId,
          bookId: book.id.toString()
        }
      })

      // ローカル状態も更新
      const favoriteBook: FavoriteBook = {
        id: book.id,
        title: book.title,
        author: Array.isArray(book.author) ? book.author.join(', ') : book.author,
        imageUrl: book.imageUrl || '',
        category: Array.isArray(book.category) ? book.category[0] || '' : book.category || '',
        mentionCount: book.mentionCount,
        goodBookScore: book.goodBookScore,
        addedAt: new Date().toISOString()
      }

      favoriteBooks.value.push(favoriteBook)

      // ローカルストレージにもバックアップ保存
      saveToLocalStorage()

    } catch (err: unknown) {
      console.error('Failed to add to favorites:', err)
      error.value = err instanceof Error ? err.message : 'お気に入りの追加に失敗しました'
    } finally {
      loading.value = false
    }
  }

  // お気に入りから削除
  const removeFromFavorites = async (bookId: number) => {
    const index = favoriteBooks.value.findIndex(fav => fav.id === bookId)
    if (index === -1) return // 存在しない

    loading.value = true
    error.value = null

    try {
      const userId = getUserId()

      // APIからお気に入り削除リクエスト
      await $fetch('/api/favorites', {
        method: 'DELETE',
        body: {
          userId,
          bookId: bookId.toString()
        }
      })

      // ローカル状態から削除
      favoriteBooks.value.splice(index, 1)

      // ローカルストレージも更新
      saveToLocalStorage()

    } catch (err: unknown) {
      console.error('Failed to remove from favorites:', err)
      error.value = err instanceof Error ? err.message : 'お気に入りの削除に失敗しました'
    } finally {
      loading.value = false
    }
  }

  // お気に入り状態の確認
  const isFavorite = (bookId: number): boolean => {
    return favoriteBooks.value.some(fav => fav.id === bookId)
  }

  // お気に入りの切り替え
  const toggleFavorite = async (book: Book) => {
    if (!book.id) return // idが存在しない場合は早期リターン

    if (isFavorite(book.id)) {
      await removeFromFavorites(book.id)
      // 削除時のフィードバック
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100)
      }
    } else {
      await addToFavorites(book)
      // 追加時のフィードバック
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 100, 50])
      }
    }
  }

  // お気に入り数の取得
  const favoriteCount = computed(() => favoriteBooks.value.length)

  // localStorageに保存
  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tech-book-favorites', JSON.stringify(favoriteBooks.value))
    }
  }

  // APIからお気に入りを読み込み
  const loadFromAPI = async () => {
    loading.value = true
    error.value = null

    try {
      const userId = getUserId()

      const response = await $fetch<ApiFavoriteResponse>('/api/favorites', {
        method: 'GET',
        query: { userId }
      })

      if (response.success && response.data) {
        const apiBooks: FavoriteBook[] = response.data.map(item => ({
          id: parseInt(item.book.id),
          title: item.book.title,
          author: Array.isArray(item.book.author) ? item.book.author.join(', ') : item.book.author,
          imageUrl: item.book.imageUrl || '',
          category: Array.isArray(item.book.category) ? item.book.category[0] || '' : item.book.category || '',
          mentionCount: item.book.mentionCount,
          goodBookScore: item.book.goodBookScore,
          addedAt: item.createdAt
        }))

        favoriteBooks.value.splice(0, favoriteBooks.value.length, ...apiBooks)
        saveToLocalStorage() // APIデータをローカルにもバックアップ
      }

    } catch (err: unknown) {
      console.error('Failed to load favorites from API:', err)
      // APIで失敗した場合はローカルストレージから読み込み
      loadFromLocalStorage()
    } finally {
      loading.value = false
    }
  }

  // localStorageから読み込み
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tech-book-favorites')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          favoriteBooks.value.splice(0, favoriteBooks.value.length, ...parsed)
        } catch (error) {
          favoriteBooks.value.splice(0, favoriteBooks.value.length)
        }
      }
    }
  }

  // 初期化
  const initialize = async () => {
    if (typeof window !== 'undefined') {
      // まずローカルストレージから読み込み（高速表示）
      loadFromLocalStorage()
      // その後APIからの最新データで更新
      await loadFromAPI()
    }
  }

  // 初期化時に実行
  if (typeof window !== 'undefined') {
    initialize()
  }

  return {
    favoriteBooks: computed(() => favoriteBooks.value),
    favoriteCount,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    loadFromAPI,
    loadFromLocalStorage,
    initialize
  }
})