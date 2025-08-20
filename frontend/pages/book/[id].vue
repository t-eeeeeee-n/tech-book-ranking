<template>
  <div class="min-h-screen">
    <!-- Header -->
    <SimpleHeader />
    
    <div class="container mx-auto px-6 py-8">
      <div v-if="pending" class="flex justify-center items-center min-h-96">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">書籍が見つかりません</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-8">指定された書籍は存在しないか、削除された可能性があります。</p>
        <button 
          @click="goHome"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
        >
          トップページに戻る
        </button>
      </div>

      <div v-else-if="book" class="max-w-4xl mx-auto">
        <!-- パンくずナビ -->
        <nav class="mb-6 text-sm">
          <ol class="flex space-x-2 text-gray-500 dark:text-gray-400">
            <li><NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">ホーム</NuxtLink></li>
            <li>›</li>
            <li class="text-gray-800 dark:text-gray-200">{{ book.title }}</li>
          </ol>
        </nav>

        <!-- 書籍メイン情報 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-all duration-300">
          <div class="p-6 lg:p-8">
            <!-- モバイル優先：縦積みレイアウト -->
            <div class="space-y-6">
              <!-- 上部：書籍基本情報 -->
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- 書影 -->
                <div class="flex-shrink-0 mx-auto sm:mx-0">
                  <div class="w-32 h-44 sm:w-40 sm:h-56 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div v-if="book.imageUrl" class="w-full h-full">
                      <img 
                        :src="book.imageUrl" 
                        :alt="book.title"
                        class="w-full h-full object-cover"
                      >
                    </div>
                    <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      <Icon name="heroicons:book-open" class="w-8 h-8 mb-2" />
                      <p class="text-xs">書影なし</p>
                    </div>
                  </div>
                </div>

                <!-- タイトル・著者・アクション -->
                <div class="flex-grow text-center sm:text-left">
                  <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {{ book.title }}
                  </h1>
                  <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {{ Array.isArray(book.author) ? book.author.join(', ') : book.author }}
                  </p>
                  
                  <!-- カテゴリバッジとお気に入りボタン -->
                  <div class="flex justify-center sm:justify-start items-center gap-3 mb-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {{ Array.isArray(book.category) ? book.category[0] : book.category }}
                    </span>
                    
                    <!-- お気に入りボタン -->
                    <button
                      name="toggle-favorite"
                      @click="toggleFavorite"
                      class="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 focus:outline-none transition-transform duration-200 ease-out"
                      :aria-label="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
                    >
                      <span class="relative w-5 h-5">
                        <Icon
                          name="heroicons:heart-solid"
                          :class="[
                            'w-5 h-5 favorite-heart-icon',
                            isFavorite
                              ? 'text-red-500 fill-red-500 heart-filled'
                              : 'text-gray-300 fill-gray-300 heart-empty'
                          ]"
                        />
                      </span>
                    </button>
                  </div>
                  
                  <!-- アクションボタン -->
                  <div class="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start items-center">
                    <a 
                      v-if="book.amazonUrl"
                      :href="book.amazonUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
                      Amazon で購入
                    </a>
                  </div>
                </div>
              </div>

              <!-- メインスコアセクション -->
              <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
                <div class="flex flex-col lg:flex-row items-center gap-6">
                  <!-- 左側：スコア視覚化 -->
                  <div class="flex-shrink-0">
                    <div class="relative w-32 h-32 sm:w-40 sm:h-40">
                      <!-- 背景円 -->
                      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          :stroke-width="8"
                          fill="none"
                          class="text-gray-200 dark:text-gray-700"
                        />
                        <!-- スコア円 -->
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          :stroke-width="8"
                          fill="none"
                          :class="getScoreTextClass(goodBookScore)"
                          :stroke-dasharray="circumference"
                          :stroke-dashoffset="getStrokeDashoffset(goodBookScore)"
                          stroke-linecap="round"
                          class="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <!-- 中央のスコア -->
                      <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-3xl sm:text-4xl font-bold" :class="getScoreTextClass(goodBookScore)">
                          {{ goodBookScore }}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">
                          {{ getScoreLabel(goodBookScore).replace(/🏆|⭐|🌟|👍|📚|💭/, '').trim() }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 中央：スコア構成要素 -->
                  <div class="flex-grow">
                    <div class="text-center lg:text-left mb-4">
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">📊 いい本スコア</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">記事数・LGTM・最新性から算出</p>
                    </div>
                    
                    <!-- スコア内訳（基本表示） -->
                    <div class="space-y-3 mb-4">
                      <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400 flex-1">記事数</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">40%</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400 flex-1">LGTM数</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">35%</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400 flex-1">最新性</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">25%</span>
                      </div>
                    </div>

                    <!-- 詳細表示ボタン -->
                    <div class="flex items-center justify-between">
                      <button 
                        ref="scoreButton"
                        @click="toggleScoreDetails"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 flex items-center gap-1 hover:scale-105"
                      >
                        <Icon name="heroicons:information-circle" class="w-5 h-5" />
                        算出方法を見る
                      </button>
                    </div>

                    <!-- スコア詳細ポップオーバー（Teleport版・デスクトップ） -->
                    <Teleport to="body">
                      <div 
                        v-if="showScoreDetails && !isMobile" 
                        class="fixed w-96 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm"
                        :style="popoverStyle"
                        data-score-popover
                        @click.stop
                      >
                        <div class="space-y-4">
                          <div class="flex justify-between items-center">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">スコア算出方法</h4>
                            <button 
                              @click="showScoreDetails = false"
                              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 rounded-full p-1"
                            >
                              <Icon name="heroicons:x-mark" class="w-5 h-5" />
                            </button>
                          </div>
                          
                          <!-- スコア構成要素 -->
                          <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                              <div class="flex items-center gap-3">
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                  <div class="font-medium text-green-700 dark:text-green-400 text-sm">記事数</div>
                                  <div class="text-xs text-green-600 dark:text-green-300">{{ book.uniqueArticleCount || 0 }}件</div>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                  <div class="h-1.5 bg-green-500 rounded-full" style="width: 40%"></div>
                                </div>
                                <span class="text-sm font-bold text-green-600 dark:text-green-400">40%</span>
                              </div>
                            </div>
                            
                            <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                              <div class="flex items-center gap-3">
                                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <div>
                                  <div class="font-medium text-purple-700 dark:text-purple-400 text-sm">LGTM数</div>
                                  <div class="text-xs text-purple-600 dark:text-purple-300">{{ mentions.reduce((sum, m) => sum + m.articleLikes, 0) || 245 }}件</div>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                  <div class="h-1.5 bg-purple-500 rounded-full" style="width: 35%"></div>
                                </div>
                                <span class="text-sm font-bold text-purple-600 dark:text-purple-400">35%</span>
                              </div>
                            </div>
                            
                            <div class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                              <div class="flex items-center gap-3">
                                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <div>
                                  <div class="font-medium text-orange-700 dark:text-orange-400 text-sm">最新性</div>
                                  <div class="text-xs text-orange-600 dark:text-orange-300">{{ getRecencyLabel(book.lastMentionedAt || new Date().toISOString()) }}</div>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                  <div class="h-1.5 bg-orange-500 rounded-full" style="width: 25%"></div>
                                </div>
                                <span class="text-sm font-bold text-orange-600 dark:text-orange-400">25%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Teleport>

                    <!-- スコア詳細モーダル（モバイル） -->
                    <div 
                      v-if="showScoreDetails && isMobile" 
                      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                      @click="showScoreDetails = false"
                    >
                        <div 
                          class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                          data-score-popover
                          @click.stop
                        >
                          <div class="space-y-4">
                            <div class="flex justify-between items-center">
                              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">スコア算出方法</h4>
                              <button 
                                @click="showScoreDetails = false"
                                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 rounded-full p-1"
                              >
                                <Icon name="heroicons:x-mark" class="w-6 h-6" />
                              </button>
                            </div>
                            
                            <!-- スコア構成要素 -->
                            <div class="space-y-3">
                              <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <div class="flex items-center gap-3">
                                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <div>
                                    <div class="font-medium text-green-700 dark:text-green-400 text-sm">記事数</div>
                                    <div class="text-xs text-green-600 dark:text-green-300">{{ book.uniqueArticleCount || 0 }}件</div>
                                  </div>
                                </div>
                                <div class="flex items-center gap-2">
                                  <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                    <div class="h-1.5 bg-green-500 rounded-full" style="width: 40%"></div>
                                  </div>
                                  <span class="text-sm font-bold text-green-600 dark:text-green-400">40%</span>
                                </div>
                              </div>
                              
                              <div class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                <div class="flex items-center gap-3">
                                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <div>
                                    <div class="font-medium text-purple-700 dark:text-purple-400 text-sm">LGTM数</div>
                                    <div class="text-xs text-purple-600 dark:text-purple-300">{{ mentions.reduce((sum, m) => sum + m.articleLikes, 0) || 245 }}件</div>
                                  </div>
                                </div>
                                <div class="flex items-center gap-2">
                                  <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                    <div class="h-1.5 bg-purple-500 rounded-full" style="width: 35%"></div>
                                  </div>
                                  <span class="text-sm font-bold text-purple-600 dark:text-purple-400">35%</span>
                                </div>
                              </div>
                              
                              <div class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                                <div class="flex items-center gap-3">
                                  <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                                  <div>
                                    <div class="font-medium text-orange-700 dark:text-orange-400 text-sm">最新性</div>
                                    <div class="text-xs text-orange-600 dark:text-orange-300">{{ getRecencyLabel(book.lastMentionedAt || new Date().toISOString()) }}</div>
                                  </div>
                                </div>
                                <div class="flex items-center gap-2">
                                  <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                    <div class="h-1.5 bg-orange-500 rounded-full" style="width: 25%"></div>
                                  </div>
                                  <span class="text-sm font-bold text-orange-600 dark:text-orange-400">25%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  <!-- 右側：ランキング情報 -->
                  <div class="flex-shrink-0 lg:w-80">
                    <div class="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <div class="text-center lg:text-left mb-4">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">🏆 ランキング情報</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">現在の順位</p>
                      </div>
                      
                      <!-- 全体ランキング -->
                      <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                          <div>
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">全体ランキング</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">全期間・全分野</div>
                          </div>
                          <div class="text-right">
                            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ overallRank }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">/ {{ overallTotal.toLocaleString() }}冊</div>
                          </div>
                        </div>

                        <!-- フィルタリング時のランキング -->
                        <div v-if="filteredRank !== null" class="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                          <div>
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ filterLabel }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">条件絞り込み時</div>
                          </div>
                          <div class="text-right">
                            <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ filteredRank }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">/ {{ filteredTotal.toLocaleString() }}冊</div>
                          </div>
                        </div>

                        <!-- フィルター状態の説明 -->
                        <div v-if="filteredRank !== null" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                          <Icon name="heroicons:information-circle" class="w-3 h-3 inline mr-1" />
                          ランキングページからの絞り込み条件を反映
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 詳細指標 -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- 言及数 -->
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:fire" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ book.mentionCount }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">言及数</div>
                    </div>
                  </div>
                </div>

                <!-- 記事数 -->
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:document-text" class="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ book.uniqueArticleCount || 0 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">記事数</div>
                    </div>
                  </div>
                </div>

                <!-- LGTM数 -->
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:heart" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ mentions.reduce((sum, m) => sum + m.articleLikes, 0) || 245 }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">LGTM</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


        <!-- 書誌情報・タグセクション -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          <div class="border-b border-gray-100 dark:border-gray-700">
            <nav class="flex">
              <button 
                @click="activeTab = 'details'"
                :class="activeTab === 'details' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                class="px-6 py-4 text-sm font-medium transition-colors"
              >
                📖 詳細情報
              </button>
              <button 
                @click="activeTab = 'tags'"
                :class="activeTab === 'tags' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                class="px-6 py-4 text-sm font-medium transition-colors"
              >
                🏷️ タグ
              </button>
              <button 
                @click="activeTab = 'publication'"
                :class="activeTab === 'publication' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                class="px-6 py-4 text-sm font-medium transition-colors"
              >
                📚 出版情報
              </button>
            </nav>
          </div>
          
          <div class="p-6">
            <!-- 詳細情報タブ -->
            <div v-if="activeTab === 'details'">
              <div v-if="book.description" class="mb-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">概要</h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ book.description }}</p>
              </div>
              <div class="flex flex-wrap gap-2 mb-3">
                <span 
                  v-for="category in (Array.isArray(book.category) ? book.category : [book.category])" 
                  :key="category"
                  class="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full"
                >
                  {{ category }}
                </span>
              </div>
            </div>

            <!-- タグタブ -->
            <div v-if="activeTab === 'tags'">
              <div v-if="book.tags" class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in book.tags" 
                  :key="tag"
                  class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer hover:scale-105"
                >
                  #{{ tag }}
                </span>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 text-sm">タグ情報がありません</div>
            </div>

            <!-- 出版情報タブ -->
            <div v-if="activeTab === 'publication'">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div v-if="book.publishedYear">
                  <span class="font-medium text-gray-600 dark:text-gray-400">出版年:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ book.publishedYear }}年</span>
                </div>
                <div v-if="book.publisher">
                  <span class="font-medium text-gray-600 dark:text-gray-400">出版社:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ book.publisher }}</span>
                </div>
                <div v-if="book.isbn13 || book.isbn10">
                  <span class="font-medium text-gray-600 dark:text-gray-400">ISBN:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ book.isbn13 || book.isbn10 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 言及記事一覧 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">この書籍が言及されている記事</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2">{{ mentions.length }}件の記事でこの書籍が紹介されています</p>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="mention in mentions" 
              :key="mention.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]"
            >
              <div class="flex items-start justify-between">
                <div class="flex-grow">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    <a 
                      :href="mention.articleUrl" 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:underline"
                    >
                      {{ mention.articleTitle }}
                    </a>
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-3">{{ mention.context }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(mention.mentionedAt) }}</span>
                    <span class="flex items-center">
                      <Icon name="heroicons:heart" class="w-4 h-4 mr-1" />
                      {{ mention.articleLikes }}
                    </span>
                    <span v-if="mention.sentiment" class="capitalize">
                      {{ getSentimentIcon(mention.sentiment) }} {{ mention.sentiment }}
                    </span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">信頼度</div>
                    <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {{ Math.round(mention.confidence * 100) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mentions.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>まだ言及記事がありません</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book, BookApiResponse, DetailedRankingApiResponse, MentionsApiResponse, RankingItem } from '~/types'
import { useFavoritesStore } from '~/stores/favorites'
const route = useRoute()
const bookId = route.params.id

// 書籍データを取得
const { data: bookResponse, pending, error } = await useFetch<BookApiResponse>(`/api/books/${bookId}`)

// URLパラメータからフィルター状態を取得
const filterCategory = route.query.category as string || ''
const filterPeriod = route.query.period as string || 'all'

// 全体ランキングデータを取得
const { data: overallRankingData } = await useFetch<DetailedRankingApiResponse>(`/api/rankings`, {
  query: {
    type: 'overall',
    period: 'all',
    limit: 1000
  }
})

// フィルタリング時の条件付きランキングデータを取得
const { data: filteredRankingData } = await useFetch<DetailedRankingApiResponse>(`/api/rankings`, {
  query: {
    type: 'overall',
    category: filterCategory || undefined,
    period: filterPeriod !== 'all' ? filterPeriod : undefined,
    limit: 1000
  },
  default: () => null
})

// book データを取得（デフォルト値を含む）
const book = computed((): Book | null => {
  const rawBook = bookResponse.value?.data
  if (!rawBook) return null
  
  // 型アサーションで明示的にBook型として扱う（unknownを経由して安全に）
  const typedBook = rawBook as Book
  
  // 不足しているプロパティにデフォルト値を設定
  return {
    ...typedBook,
    // Map old fields to new structure for compatibility
    id: typedBook.id || parseInt(typedBook._id.slice(-8), 16)
  }
})

// お気に入りストアを使用
const favoritesStore = useFavoritesStore()

// ハイドレーション問題を回避するため、クライアントサイドでのみお気に入り状態を表示
const isClient = ref(false)
const isFavorite = computed(() => {
  if (!isClient.value) return false // SSR時は常にfalse
  return book.value ? favoritesStore.isFavorite(book.value.id!) : false
})

// クライアントサイドでマウント後に状態を更新
onMounted(() => {
  isClient.value = true
})

// お気に入りの切り替え
const toggleFavorite = () => {
  if (book.value) {
    favoritesStore.toggleFavorite(book.value)
    
    // 簡単なフィードバック効果
    if (typeof window !== 'undefined') {
      // ハートアニメーション用の一時的なクラス追加
      const button = document.activeElement as HTMLElement
      if (button) {
        button.classList.add('animate-pulse')
        setTimeout(() => {
          button.classList.remove('animate-pulse')
        }, 200)
      }
    }
  }
}

// ホームに戻る
const goHome = () => {
  navigateTo('/')
}

// いい本スコア（仮データ）
const goodBookScore = ref(83)

// スコア詳細の表示状態
const showScoreDetails = ref(false)

// モバイル判定
const isMobile = ref(false)

// ポップオーバーの位置とスタイル
const scoreButton = ref<HTMLElement | null>(null)
const popoverStyle = ref({})

// タブの状態
const activeTab = ref('details')

// モックの言及データ（実際の実装では API から取得）
// Fetch mentions data from API
const { data: mentionsResponse } = await useFetch<MentionsApiResponse>(`/api/books/${bookId}/mentions`)

const mentions = computed(() => {
  return mentionsResponse.value?.data?.map((mention) => ({
    id: mention.id,
    articleTitle: mention.title,
    articleUrl: mention.url,
    context: mention.context,
    confidence: mention.confidence,
    sentiment: mention.sentiment,
    mentionedAt: mention.publishedAt,
    articleLikes: mention.likesCount
  })) || []
})

// ランキング情報を検索するヘルパー関数
const findRankInData = (rankingData: DetailedRankingApiResponse | null | undefined) => {
  if (!book.value || !rankingData?.data?.rankings) return null
  
  const currentBook = book.value // null チェック後にローカル変数に保存
  
  const rankingItem = rankingData.data.rankings.find((item: RankingItem) => {
    if (!item.book) return false
    
    const bookNumericId = currentBook.id
    const bookStringId = currentBook._id
    const rankingBookNumericId = item.book.id
    const rankingBookStringId = item.book._id
    
    return (rankingBookNumericId && rankingBookNumericId === bookNumericId) ||
           (rankingBookStringId && rankingBookStringId === bookStringId)
  })
  
  return rankingItem ? {
    rank: rankingItem.rank,
    totalBooks: rankingData.data.rankings.length
  } : null
}

// 全体ランクを取得
const overallRank = computed(() => {
  const result = findRankInData(overallRankingData.value)
  return result ? result.rank : 'ランク外'
})

const overallTotal = computed(() => {
  const result = findRankInData(overallRankingData.value)
  return result ? result.totalBooks : 0
})

// フィルタリング時のランクを取得
const filteredRank = computed(() => {
  if (!filterCategory && filterPeriod === 'all') return null
  const result = findRankInData(filteredRankingData.value)
  return result ? result.rank : 'ランク外'
})

const filteredTotal = computed(() => {
  if (!filterCategory && filterPeriod === 'all') return 0
  const result = findRankInData(filteredRankingData.value)
  return result ? result.totalBooks : 0
})

// 表示用のフィルター条件ラベル
const filterLabel = computed(() => {
  const parts = []
  if (filterCategory) {
    // カテゴリ名をマッピング
    const categoryNames: Record<string, string> = {
      'programming': 'プログラミング',
      'web-development': 'Web開発', 
      'ai-machine-learning': 'AI・機械学習',
      'infrastructure': 'インフラ',
      'mobile-development': 'モバイル開発',
      'game-development': 'ゲーム開発',
      'data-science': 'データサイエンス',
      'security': 'セキュリティ',
      'devops': 'DevOps',
      'design': 'デザイン'
    }
    parts.push(categoryNames[filterCategory] || filterCategory)
  }
  if (filterPeriod !== 'all') {
    const periodNames: Record<string, string> = {
      'year': '過去1年',
      'month': '過去1ヶ月', 
      'week': '過去1週間'
    }
    parts.push(periodNames[filterPeriod] || filterPeriod)
  }
  return parts.join('・')
})


function getSentimentIcon(sentiment: string): string {
  switch (sentiment) {
    case 'positive': return '😊'
    case 'negative': return '😞'
    default: return '😐'
  }
}

function formatDate(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString as string | number | Date)
    if (isNaN(date.getTime())) {
      return String(dateString)
    }
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return String(dateString)
  }
}

// Score related functions
function getScoreTextClass(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  if (score >= 60) return 'text-orange-500 dark:text-orange-400'
  return 'text-red-500 dark:text-red-400'
}
function getScoreLabel(score: number): string {
  if (score >= 90) return '🏆 殿堂入り'
  if (score >= 80) return '⭐ 超おすすめ'
  if (score >= 70) return '🌟 おすすめ'
  if (score >= 60) return '👍 良書'
  if (score >= 40) return '📚 普通'
  return '💭 要検討'
}
function getRecencyLabel(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const monthsAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
  
  if (monthsAgo < 1) return '今月'
  if (monthsAgo < 3) return `${monthsAgo}ヶ月前`
  if (monthsAgo < 12) return `${monthsAgo}ヶ月前`
  const yearsAgo = Math.floor(monthsAgo / 12)
  return `${yearsAgo}年前`
}

// スコア詳細の表示切り替え
function toggleScoreDetails() {
  showScoreDetails.value = !showScoreDetails.value
}

// レスポンシブ対応とポップオーバーの位置調整
onMounted(() => {
  // モバイル判定
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  // ポップオーバーの位置調整
  const updatePopoverPosition = () => {
    if (showScoreDetails.value && !isMobile.value && scoreButton.value) {
      const buttonRect = scoreButton.value.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const popoverWidth = 384 // w-96 = 24rem = 384px
      const popoverHeight = 280 // 推定の高さ
      
      // ボタンの位置を基準に計算（position: fixedなのでscrollは不要）
      let left = buttonRect.left
      let top = buttonRect.bottom + 8 // ボタンの下に8px空ける
      
      
      // 右端にはみ出る場合は左側に調整
      if (left + popoverWidth > viewportWidth - 20) {
        left = buttonRect.right - popoverWidth
      }
      
      // 下端にはみ出る場合は上側に表示
      if (top + popoverHeight > viewportHeight - 20) {
        top = buttonRect.top - popoverHeight - 8
      }
      
      // 左端にはみ出る場合は最小マージンを確保
      if (left < 20) {
        left = 20
      }
      
      // 上端にはみ出る場合は最小マージンを確保
      if (top < 20) {
        top = 20
      }
      
      popoverStyle.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 9999
      }
    }
  }

  // 外部クリックでポップオーバーを閉じる
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (showScoreDetails.value && !target.closest('[data-score-popover]') && !target.closest('button')) {
      showScoreDetails.value = false
    }
  }

  // 初期チェック
  checkMobile()
  
  // イベントリスナー追加
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
  
  // スコア詳細表示時の位置調整
  watch(showScoreDetails, () => {
    if (showScoreDetails.value) {
      nextTick(() => {
        updatePopoverPosition()
      })
    }
  })
  
  // スクロールやリサイズ時の位置更新
  window.addEventListener('scroll', updatePopoverPosition)
  window.addEventListener('resize', updatePopoverPosition)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', updatePopoverPosition)
    window.removeEventListener('resize', updatePopoverPosition)
  })
})

// 初期化時にモバイル判定を実行
if (typeof window !== 'undefined') {
  isMobile.value = window.innerWidth < 768
}
// 円グラフ用の計算
const circumference = 2 * Math.PI * 70 // r=70

function getStrokeDashoffset(score: number): number {
  const progress = Math.min(100, Math.max(0, score))
  return circumference - (progress / 100) * circumference
}

// SEO設定
useHead({
  title: computed(() => `${book.value?.title || '書籍詳細'} - Tech Book Rank`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => book.value ? 
        `${book.value.title}の詳細情報。${book.value.mentionCount}回言及されている人気の技術書です。` :
        '技術書の詳細情報を確認できます。')
    }
  ]
})
</script>

<style scoped>
/* お気に入り状態のハートアイコンを確実に赤色で塗りつぶし */
.heart-filled :deep(svg) {
  color: #ef4444 !important;
  fill: #ef4444 !important;
}

.heart-filled :deep(svg path) {
  fill: #ef4444 !important;
  stroke: #ef4444 !important;
}

.heart-empty :deep(svg) {
  color: #d1d5db !important;
  fill: #d1d5db !important;
}

.heart-empty :deep(svg path) {
  fill: #d1d5db !important;
  stroke: #d1d5db !important;
}

/* より具体的なセレクター */
.favorite-heart-icon.text-red-500 :deep(svg) {
  color: #ef4444 !important;
  fill: #ef4444 !important;
}

.favorite-heart-icon.text-red-500 :deep(svg path) {
  fill: #ef4444 !important;
  stroke: #ef4444 !important;
}

.favorite-heart-icon.fill-red-500 :deep(svg) {
  fill: #ef4444 !important;
}

.favorite-heart-icon.fill-red-500 :deep(svg path) {
  fill: #ef4444 !important;
  stroke: #ef4444 !important;
}

.favorite-heart-icon.text-gray-300 :deep(svg) {
  color: #d1d5db !important;
  fill: #d1d5db !important;
}

.favorite-heart-icon.text-gray-300 :deep(svg path) {
  fill: #d1d5db !important;
  stroke: #d1d5db !important;
}

.favorite-heart-icon.fill-gray-300 :deep(svg) {
  fill: #d1d5db !important;
}

.favorite-heart-icon.fill-gray-300 :deep(svg path) {
  fill: #d1d5db !important;
  stroke: #d1d5db !important;
}
</style>

