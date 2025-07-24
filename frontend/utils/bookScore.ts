/**
 * 「いい本スコア」計算ユーティリティ
 * 3つの指標（記事数、LGTM数、最新投稿日）から0-100のスコアを算出
 */

export type BookScoreInput = {
  id: number
  title: string
  articleCount: number
  totalLikes: number
  newestArticleDate: string // ISO 8601形式（例："2024-12-01"）
}

export type ScoreWeights = {
  articleCount: number  // 記事数の重み（デフォルト: 40%）
  totalLikes: number    // LGTM数の重み（デフォルト: 35%）
  recency: number       // 最新性の重み（デフォルト: 25%）
}

export type ScoreThresholds = {
  maxArticleCount: number  // 記事数の最大値（デフォルト: 50）
  maxTotalLikes: number    // LGTM数の最大値（デフォルト: 500）
  recencyMonths: number    // 最新性を考慮する月数（デフォルト: 12ヶ月）
}

/**
 * 日付の差分を月単位で計算
 * @param dateString ISO形式の日付文字列
 * @returns 現在日からの月数差分
 */
function getMonthsFromNow(dateString: string): number {
  try {
    const targetDate = new Date(dateString)
    const now = new Date()
    
    // 無効な日付の場合は大きな値を返す（古い扱い）
    if (isNaN(targetDate.getTime())) {
      return 999
    }
    
    // 月単位での差分を計算
    const yearDiff = now.getFullYear() - targetDate.getFullYear()
    const monthDiff = now.getMonth() - targetDate.getMonth()
    
    return yearDiff * 12 + monthDiff
  } catch {
    return 999 // エラーの場合は古い扱い
  }
}

/**
 * 値を0-100の範囲に正規化
 * @param value 正規化する値
 * @param max 最大値
 * @returns 0-100の範囲の値
 */
function normalizeToScore(value: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.max(0, (value / max) * 100))
}

/**
 * 最新性スコアを計算（指数減衰）
 * @param monthsFromNow 現在からの月数
 * @param maxMonths 最大考慮月数
 * @returns 0-100の最新性スコア
 */
function calculateRecencyScore(monthsFromNow: number, maxMonths: number): number {
  if (monthsFromNow <= 0) {
    return 100 // 未来の日付は最高点
  }
  
  if (monthsFromNow >= maxMonths) {
    return 0 // 指定月数以上古い場合は0点
  }
  
  // 指数減衰：最初の6ヶ月は緩やか、その後急激に減少
  const decay = Math.exp(-monthsFromNow / (maxMonths * 0.3))
  return Math.max(0, decay * 100)
}

/**
 * 「いい本スコア」を計算
 * @param book 書籍データ
 * @param weights スコア重み設定（オプション）
 * @param thresholds スコア閾値設定（オプション）
 * @returns 0-100の「いい本スコア」
 */
export function getGoodBookScore(
  book: BookScoreInput,
  weights: ScoreWeights = {
    articleCount: 0.4,  // 40%
    totalLikes: 0.35,   // 35%
    recency: 0.25       // 25%
  },
  thresholds: ScoreThresholds = {
    maxArticleCount: 50,   // 最大50記事
    maxTotalLikes: 500,    // 最大500LGTM
    recencyMonths: 12      // 12ヶ月以内
  }
): number {
  // 1. 記事数スコア（0-100）
  const articleScore = normalizeToScore(book.articleCount, thresholds.maxArticleCount)
  
  // 2. LGTM数スコア（0-100）
  const likesScore = normalizeToScore(book.totalLikes, thresholds.maxTotalLikes)
  
  // 3. 最新性スコア（0-100）
  const monthsFromNow = getMonthsFromNow(book.newestArticleDate)
  const recencyScore = calculateRecencyScore(monthsFromNow, thresholds.recencyMonths)
  
  // 4. 重み付き平均でスコア算出
  const weightedScore = 
    (articleScore * weights.articleCount) +
    (likesScore * weights.totalLikes) +
    (recencyScore * weights.recency)
  
  // 5. 0-100の範囲に収める
  const finalScore = Math.min(100, Math.max(0, weightedScore))
  
  
  return Math.round(finalScore * 10) / 10 // 小数点1桁で四捨五入
}

/**
 * 複数の書籍のスコアを一括計算
 * @param books 書籍データの配列
 * @param weights スコア重み設定（オプション）
 * @param thresholds スコア閾値設定（オプション）
 * @returns スコア付きの書籍データ配列
 */
export function calculateBooksScores(
  books: BookScoreInput[],
  weights?: ScoreWeights,
  thresholds?: ScoreThresholds
): (BookScoreInput & { goodBookScore: number })[] {
  return books.map(book => ({
    ...book,
    goodBookScore: getGoodBookScore(book, weights, thresholds)
  }))
}

/**
 * スコアレベルを文字列で取得
 * @param score 0-100のスコア
 * @returns スコアレベル文字列
 */
export function getScoreLevel(score: number): string {
  if (score >= 90) return '🏆 殿堂入り'
  if (score >= 80) return '⭐ 超おすすめ'
  if (score >= 70) return '🌟 おすすめ'
  if (score >= 60) return '👍 良書'
  if (score >= 40) return '📚 普通'
  return '💭 要検討'
}

/**
 * スコアに応じたカラークラス（Tailwind CSS）を取得
 * @param score 0-100のスコア
 * @returns Tailwind CSSのカラークラス
 */
export function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-yellow-600'      // ゴールド
  if (score >= 80) return 'text-purple-600'     // パープル
  if (score >= 70) return 'text-blue-600'       // ブルー
  if (score >= 60) return 'text-green-600'      // グリーン
  if (score >= 40) return 'text-gray-600'       // グレー
  return 'text-red-600'                         // レッド
}