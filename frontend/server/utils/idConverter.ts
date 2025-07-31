// MongoDB ObjectID文字列から数値IDを生成するヘルパー関数
export function convertStringIdToNumber(stringId: string): number {
  return Math.abs(stringId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0))
}

// 書籍データにIDを追加するヘルパー関数
export function addNumericId<T extends { _id: string }>(item: T): T & { id: number } {
  return {
    ...item,
    id: convertStringIdToNumber(item._id)
  }
}