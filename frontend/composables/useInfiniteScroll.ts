import type { Book, PaginatedResponse } from '~/types'

export interface InfiniteScrollOptions {
  initialPage?: number
  initialLimit?: number
  category?: string
  search?: string
  period?: string
  sort?: string
}

export interface InfiniteScrollState {
  books: Book[]
  loading: boolean
  hasMore: boolean
  currentPage: number
  totalBooks: number
  error: string | null
  loadingMore: boolean
}

export const useInfiniteScroll = (options: InfiniteScrollOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 24,
    category = '',
    search = '',
    period = 'all',
    sort = 'mentions'
  } = options

  // リアクティブな状態
  const state = reactive<InfiniteScrollState>({
    books: [],
    loading: false,
    hasMore: true,
    currentPage: initialPage,
    totalBooks: 0,
    error: null,
    loadingMore: false
  })

  // フィルター状態
  const filters = reactive({
    category,
    search,
    period,
    sort
  })

  // IntersectionObserver用の参照
  const targetRef = ref<HTMLElement | null>(null)
  const observer = ref<IntersectionObserver | null>(null)
  const isObserverSetup = ref(false)

  // URLクエリパラメータ管理
  const route = useRoute()
  const router = useRouter()

  // 初期データの取得
  const fetchInitialData = async () => {
    console.log('🔄 Fetching initial data...')
    state.loading = true
    state.error = null
    
    try {
      const response = await $fetch<PaginatedResponse<Book>>('/api/books', {
        query: {
          page: 1,
          limit: initialLimit,
          category: filters.category || undefined,
          search: filters.search || undefined,
          period: filters.period !== 'all' ? filters.period : undefined,
          sort: filters.sort
        }
      })

      console.log('✅ Initial data fetched:', response.data.length, 'books', 'hasMore:', response.hasMore)
      state.books = response.data
      state.totalBooks = response.total
      state.hasMore = response.hasMore
      state.currentPage = 1
      
      // 初期データ取得後にObserverを設定
      nextTick(() => {
        setupIntersectionObserver()
      })
    } catch (error) {
      state.error = 'データの取得に失敗しました'
      console.error('❌ Error fetching initial data:', error)
    } finally {
      state.loading = false
    }
  }

  // 次のページを取得（外部から呼び出し可能）
  const fetchNextPage = async () => {
    console.log('🚀 fetchNextPage called', { 
      hasMore: state.hasMore, 
      loadingMore: state.loadingMore,
      currentPage: state.currentPage 
    })
    
    if (!state.hasMore || state.loadingMore) {
      console.log('⏭️ Skip fetching next page:', { hasMore: state.hasMore, loadingMore: state.loadingMore })
      return
    }

    console.log('🔄 Fetching next page:', state.currentPage + 1)
    state.loadingMore = true
    
    try {
      const nextPage = state.currentPage + 1
      const response = await $fetch<PaginatedResponse<Book>>('/api/books', {
        query: {
          page: nextPage,
          limit: initialLimit,
          category: filters.category || undefined,
          search: filters.search || undefined,
          period: filters.period !== 'all' ? filters.period : undefined,
          sort: filters.sort
        }
      })

      console.log('✅ Next page fetched:', response.data.length, 'books', 'hasMore:', response.hasMore)
      
      // 新しいデータを既存のデータに追加
      state.books.push(...response.data)
      state.hasMore = response.hasMore
      state.currentPage = nextPage

      // URLを更新（SEO対応）
      await updateUrl(nextPage)
    } catch (error) {
      state.error = 'データの取得に失敗しました'
      console.error('❌ Error fetching next page:', error)
    } finally {
      state.loadingMore = false
    }
  }

  // URLパラメータを更新
  const updateUrl = async (page: number) => {
    try {
      const query: Record<string, any> = { ...route.query }
      
      if (page > 1) {
        query.page = page
      } else {
        delete query.page
      }
      
      if (filters.category) query.category = filters.category
      if (filters.search) query.search = filters.search
      if (filters.period !== 'all') query.period = filters.period
      if (filters.sort !== 'mentions') query.sort = filters.sort

      await router.replace({ query })
    } catch (error) {
      console.error('URL update failed:', error)
    }
  }

  // フィルター変更時の処理
  const resetWithFilters = async (newFilters: Partial<typeof filters>) => {
    console.log('🔄 Resetting with filters:', newFilters)
    
    // Observerを一旦クリーンアップ
    cleanupIntersectionObserver()
    
    Object.assign(filters, newFilters)
    state.currentPage = 1
    state.books = []
    state.hasMore = true
    
    await fetchInitialData()
    await updateUrl(1)
  }

  // IntersectionObserverの設定
  const setupIntersectionObserver = () => {
    // すでに設定済みまたはサーバーサイドの場合はスキップ
    if (!process.client || isObserverSetup.value || !targetRef.value) {
      console.log('⚠️ Observer setup skipped:', { 
        isClient: process.client, 
        isSetup: isObserverSetup.value, 
        hasTarget: !!targetRef.value 
      })
      return
    }
    
    console.log('🔧 Setting up IntersectionObserver...')
    
    // 既存のObserverがあれば削除
    cleanupIntersectionObserver()

    observer.value = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        console.log('👀 Intersection observed:', {
          isIntersecting: target.isIntersecting,
          hasMore: state.hasMore,
          loadingMore: state.loadingMore,
          currentPage: state.currentPage
        })
        
        if (target.isIntersecting && state.hasMore && !state.loadingMore) {
          console.log('🚀 Triggering fetchNextPage from Observer')
          fetchNextPage()
        }
      },
      {
        rootMargin: '300px', // より大きなマージンに変更
        threshold: 0.1
      }
    )

    observer.value.observe(targetRef.value)
    isObserverSetup.value = true
    console.log('✅ IntersectionObserver set up successfully')
  }

  // IntersectionObserverの解除
  const cleanupIntersectionObserver = () => {
    if (observer.value) {
      console.log('🧹 Cleaning up IntersectionObserver')
      observer.value.disconnect()
      observer.value = null
      isObserverSetup.value = false
    }
  }

  // SEO用のメタデータを生成
  const generateSeoMeta = () => {
    const baseTitle = 'テクランBooks - 技術書ランキング'
    const currentPageNum = state.currentPage
    
    let title = baseTitle
    let description = 'エンジニアが実際に参考にしている技術書のランキング。Qiita記事での言及数をもとに、信頼できる技術書を発見できます。'
    
    if (currentPageNum > 1) {
      title = `${baseTitle} - ${currentPageNum}ページ目`
      description = `技術書ランキングの${currentPageNum}ページ目。${state.totalBooks}冊の技術書から厳選された書籍をご紹介。`
    }
    
    if (filters.category) {
      const categoryMap: Record<string, string> = {
        'programming': 'プログラミング',
        'web': 'Web開発',
        'mobile': 'モバイル開発',
        'ai': 'AI・機械学習',
        'infrastructure': 'インフラ・DevOps'
      }
      const categoryName = categoryMap[filters.category] || filters.category
      title = `${categoryName}の技術書ランキング - テクランBooks`
      description = `${categoryName}に関する技術書のランキング。実際のエンジニアが参考にしている書籍をご紹介。`
    }
    
    if (filters.search) {
      title = `「${filters.search}」の検索結果 - テクランBooks`
      description = `「${filters.search}」に関する技術書の検索結果。Qiita記事での言及数をもとにランキング表示。`
    }

    return {
      title,
      description,
      keywords: '技術書,ランキング,プログラミング,エンジニア,Qiita,書籍,おすすめ'
    }
  }

  // フィルター変更の監視
  watch(
    () => [filters.category, filters.search, filters.period, filters.sort],
    () => {
      resetWithFilters(filters)
    }
  )

  // targetRefの変更を監視してObserverを再設定
  watch(targetRef, (newValue) => {
    console.log('👀 targetRef changed:', !!newValue)
    if (newValue && process.client && !isObserverSetup.value) {
      setTimeout(() => {
        setupIntersectionObserver()
      }, 100)
    }
  })

  return {
    // 状態
    state: readonly(state),
    filters,
    targetRef,
    
    // メソッド
    fetchInitialData,
    fetchNextPage, // 重要：外部から呼び出し可能
    resetWithFilters,
    setupIntersectionObserver,
    cleanupIntersectionObserver,
    generateSeoMeta,
    
    // 計算されたプロパティ
    books: computed(() => state.books),
    loading: computed(() => state.loading),
    loadingMore: computed(() => state.loadingMore),
    hasMore: computed(() => state.hasMore),
    currentPage: computed(() => state.currentPage),
    totalBooks: computed(() => state.totalBooks),
    error: computed(() => state.error),
    
    // SEO
    seoMeta: computed(() => generateSeoMeta())
  }
}