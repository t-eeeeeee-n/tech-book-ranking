<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-6 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            テクランBooksについて
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            エンジニアが本当におすすめする技術書を、Qiitaでの言及データから自動的にランキング化したサービスです
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- What is TechRank Books -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            テクランBooksとは
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              テクランBooksは、技術者向けプラットフォーム「Qiita」で言及されている技術書を自動的に収集・分析し、
              エンジニアが実際に読んで価値を感じた書籍をランキング形式で紹介するサービスです。
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              従来の書評サイトとは異なり、実際にその技術書を読んで記事を書いたエンジニアの生の声を
              データ化することで、より実践的で信頼性の高い技術書推薦を実現しています。
            </p>
          </div>
        </section>

        <!-- Features -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            主な機能
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <Icon name="heroicons:chart-bar" class="w-6 h-6 text-cyan-600 mr-3" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  リアルタイムランキング
                </h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                Qiitaでの言及データを毎日自動更新し、最新のトレンドを反映したランキングを提供
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <Icon name="heroicons:funnel" class="w-6 h-6 text-cyan-600 mr-3" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  カテゴリ別検索
                </h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                プログラミング、Web開発、AI・機械学習など、技術分野別にランキングを絞り込み可能
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <Icon name="heroicons:heart" class="w-6 h-6 text-cyan-600 mr-3" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  お気に入り機能
                </h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                気になる技術書をお気に入りに保存して、あとでまとめて確認可能
              </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <Icon name="heroicons:link" class="w-6 h-6 text-cyan-600 mr-3" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Amazon連携
                </h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                各書籍のAmazonページへ直接アクセスして、詳細情報や購入が可能
              </p>
            </div>
          </div>
        </section>

        <!-- Data Source -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            データソース
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div class="flex items-start">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-cyan-600 mr-3 mt-1" />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Qiita記事の分析
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-3">
                  技術書が言及されているQiita記事を自動収集・分析し、以下の指標でランキングを算出：
                </p>
                <ul class="text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• 言及記事数（その技術書について書かれた記事の数）</li>
                  <li>• いいね数の合計（記事に対する評価の総和）</li>
                  <li>• 最新性（最近言及された技術書ほど高評価）</li>
                  <li>• 記事の質（詳細な技術解説記事ほど高評価）</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Technology Stack -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            技術スタック
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  フロントエンド
                </h3>
                <ul class="text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Nuxt 3</li>
                  <li>• Vue 3</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Pinia（状態管理）</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  バックエンド（予定）
                </h3>
                <ul class="text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Node.js</li>
                  <li>• Express</li>
                  <li>• MongoDB</li>
                  <li>• Qiita API</li>
                  <li>• Amazon Product Advertising API</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            お問い合わせ
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              サービスに関するご質問、ご要望、バグ報告などがございましたら、
              以下のリンクからお気軽にお問い合わせください。
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="heroicons:code-bracket" class="w-4 h-4 mr-2" />
                GitHub
              </a>
              <a
                href="mailto:contact@example.com"
                class="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Icon name="heroicons:envelope" class="w-4 h-4 mr-2" />
                メールでお問い合わせ
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO設定
useHead({
  title: 'サイトについて - テクランBooks',
  meta: [
    {
      name: 'description',
      content: 'テクランBooksは、Qiitaでの言及データから技術書をランキング化するサービスです。エンジニアが実際に読んで価値を感じた書籍を発見できます。'
    },
    {
      property: 'og:title',
      content: 'サイトについて - テクランBooks'
    },
    {
      property: 'og:description',
      content: 'テクランBooksは、Qiitaでの言及データから技術書をランキング化するサービスです。エンジニアが実際に読んで価値を感じた書籍を発見できます。'
    }
  ]
})
</script>