interface RankingSEOOptions {
  currentPage: Ref<number>
  category: Ref<string>
  sort: Ref<string>
  search: Ref<string>
  totalBooks: Ref<number>
  filteredCount: Ref<number>
  books: Ref<any[]>
  itemsPerPage: number
}

export function useRankingSEO(options: RankingSEOOptions) {
  const {
    currentPage,
    category,
    sort,
    search,
    totalBooks,
    filteredCount,
    books,
    itemsPerPage
  } = options

  // Category labels
  const categoryLabels: Record<string, string> = {
    'all': 'すべて',
    'programming': 'プログラミング',
    'web-development': 'Web開発',
    'ai-machine-learning': 'AI・機械学習',
    'infrastructure': 'インフラ',
    'database': 'データベース',
    'mobile': 'モバイル開発',
    'security': 'セキュリティ'
  }

  const sortLabels: Record<string, string> = {
    'popularity': '人気順',
    'recent': '最近話題',
    'newest': '新刊順',
    'rating': '評価順'
  }

  // Computed properties
  const startRank = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const endRank = computed(() => Math.min(currentPage.value * itemsPerPage, filteredCount.value))

  const categoryLabel = computed(() => categoryLabels[category.value] || 'すべて')
  const sortLabel = computed(() => sortLabels[sort.value] || '人気順')

  const rangeText = computed(() => {
    if (filteredCount.value === 0) return ''
    
    if (currentPage.value === 1 && endRank.value === filteredCount.value) {
      return `全${filteredCount.value}冊`
    }
    
    return `${startRank.value}〜${endRank.value}位`
  })

  // Page title
  const pageTitle = computed(() => {
    const parts: string[] = []
    
    if (search.value) {
      parts.push(`「${search.value}」の検索結果`)
    }
    
    if (categoryLabel.value !== 'すべて') {
      parts.push(categoryLabel.value)
    }
    
    parts.push('技術書ランキング')
    
    if (rangeText.value) {
      parts.push(rangeText.value)
    }
    
    parts.push('Tech Book Rank')
    
    return parts.join(' | ')
  })

  // Page description
  const pageDescription = computed(() => {
    const parts: string[] = []
    
    if (search.value) {
      parts.push(`「${search.value}」の検索結果。`)
    }
    
    if (categoryLabel.value !== 'すべて') {
      parts.push(`${categoryLabel.value}の技術書ランキング${rangeText.value}。`)
    } else {
      parts.push(`技術書ランキング${rangeText.value}。`)
    }
    
    parts.push('Qiita記事で言及された技術書から、エンジニアが実際に参考にしている書籍を発見しよう。')
    
    if (sortLabel.value !== '人気順') {
      parts.push(`${sortLabel.value}で表示中。`)
    }
    
    return parts.join('')
  })

  // Canonical URL - will be passed from component
  const canonicalUrl = computed(() => {
    const baseUrl = 'https://techbookrank.com' // Replace with your actual domain
    const path = '/ranking'
    
    const params = new URLSearchParams()
    if (currentPage.value > 1) params.set('page', String(currentPage.value))
    if (category.value !== 'all') params.set('category', category.value)
    if (sort.value !== 'popularity') params.set('sort', sort.value)
    if (search.value) params.set('search', search.value)
    
    const queryString = params.toString()
    return `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`
  })

  // Structured data for SEO
  const structuredData = computed(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle.value,
      description: pageDescription.value,
      url: canonicalUrl.value,
      mainEntity: {
        '@type': 'ItemList',
        name: `技術書ランキング ${rangeText.value}`,
        description: pageDescription.value,
        numberOfItems: books.value.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: books.value.map((book, index) => ({
          '@type': 'ListItem',
          position: startRank.value + index,
          item: {
            '@type': 'Book',
            name: book.title,
            author: {
              '@type': 'Person',
              name: book.author
            },
            publisher: {
              '@type': 'Organization',
              name: book.publisher
            },
            isbn: book.isbn,
            datePublished: book.publishDate,
            url: book.amazonUrl,
            description: book.description,
            genre: categoryLabel.value,
            aggregateRating: book.mentionCount && {
              '@type': 'AggregateRating',
              ratingValue: Math.min(5, (book.mentionCount / 20) + 3), // Convert mentions to rating
              reviewCount: book.mentionCount,
              bestRating: 5,
              worstRating: 1
            }
          }
        }))
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: 'https://techbookrank.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '技術書ランキング',
            item: canonicalUrl.value
          }
        ]
      }
    }

    return data
  })

  // Pagination links for SEO
  const paginationLinks = computed(() => {
    const baseUrl = 'https://techbookrank.com'
    const path = '/ranking'
    
    const buildUrl = (page: number) => {
      const params = new URLSearchParams()
      if (page > 1) params.set('page', String(page))
      if (category.value !== 'all') params.set('category', category.value)
      if (sort.value !== 'popularity') params.set('sort', sort.value)
      if (search.value) params.set('search', search.value)
      
      const queryString = params.toString()
      return `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`
    }

    const links: { rel: string; href: string }[] = []
    
    // Previous page
    if (currentPage.value > 1) {
      links.push({
        rel: 'prev',
        href: buildUrl(currentPage.value - 1)
      })
    }
    
    // Next page
    const totalPages = Math.ceil(filteredCount.value / itemsPerPage)
    if (currentPage.value < totalPages) {
      links.push({
        rel: 'next',
        href: buildUrl(currentPage.value + 1)
      })
    }
    
    return links
  })

  // Meta tags
  const metaTags = computed(() => [
    { name: 'description', content: pageDescription.value },
    { name: 'keywords', content: `技術書,ランキング,${categoryLabel.value},エンジニア,プログラミング,書籍,おすすめ` },
    
    // Open Graph
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:site_name', content: 'Tech Book Rank' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:description', content: pageDescription.value },
    
    // Additional SEO
    { name: 'robots', content: 'index,follow' },
    { name: 'author', content: 'Tech Book Rank' }
  ])

  const linkTags = computed(() => [
    { rel: 'canonical', href: canonicalUrl.value },
    ...paginationLinks.value
  ])

  const scriptTags = computed(() => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value)
    }
  ])

  return {
    // Computed values
    pageTitle,
    pageDescription,
    canonicalUrl,
    rangeText,
    categoryLabel,
    sortLabel,
    startRank,
    endRank,
    
    // Meta tags
    metaTags,
    linkTags,
    scriptTags,
    
    // Structured data
    structuredData
  }
}