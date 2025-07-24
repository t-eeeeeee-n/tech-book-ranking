import { defineStore } from 'pinia'
import type { Book } from '~/types'

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

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteBooks = ref<FavoriteBook[]>([])

  // お気に入りに追加
  const addToFavorites = (book: Book) => {
    const existingIndex = favoriteBooks.value.findIndex(fav => fav.id === book.id)
    if (existingIndex === -1) {
      const favoriteBook: FavoriteBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl,
        category: book.category,
        mentionCount: book.mentionCount,
        goodBookScore: book.goodBookScore,
        addedAt: new Date().toISOString()
      }
      favoriteBooks.value.push(favoriteBook)
      saveToLocalStorage()
    }
  }

  // お気に入りから削除
  const removeFromFavorites = (bookId: number) => {
    const index = favoriteBooks.value.findIndex(fav => fav.id === bookId)
    if (index !== -1) {
      favoriteBooks.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // お気に入り状態の確認
  const isFavorite = (bookId: number): boolean => {
    return favoriteBooks.value.some(fav => fav.id === bookId)
  }

  // お気に入りの切り替え
  const toggleFavorite = (book: Book) => {
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id)
      // 削除時のフィードバック
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100)
      }
    } else {
      addToFavorites(book)
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

  // localStorageから読み込み
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tech-book-favorites')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          favoriteBooks.value.splice(0, favoriteBooks.value.length, ...parsed)
        } catch (error) {
          console.error('Failed to parse favorites from localStorage:', error)
          favoriteBooks.value.splice(0, favoriteBooks.value.length)
        }
      }
    }
  }

  // 初期化時にlocalStorageから読み込み
  if (typeof window !== 'undefined') {
    loadFromLocalStorage()
  }

  return {
    favoriteBooks: computed(() => favoriteBooks.value),
    favoriteCount,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    loadFromLocalStorage
  }
})