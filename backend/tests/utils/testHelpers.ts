import { Book } from '@/models'
import { Book as IBook } from '@/types'
import { mockBookData } from '../fixtures/books'

export const createTestBook = async (data: Partial<IBook> = {}): Promise<any> => {
  const bookData = {
    ...mockBookData,
    ...data,
    titleNormalized: (data.title || mockBookData.title)
      ?.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
    mentionCount: 0,
    uniqueArticleCount: 0,
    trendScore: 0,
    status: 'active'
  }

  const book = new Book(bookData)
  return await book.save()
}

export const createMultipleTestBooks = async (count: number = 3): Promise<any[]> => {
  const books = []
  for (let i = 0; i < count; i++) {
    const book = await createTestBook({
      title: `Test Book ${i + 1}`,
      isbn13: `978013235088${i}`,
      mentionCount: count - i, // Different mention counts for sorting tests
      trendScore: (count - i) * 10
    })
    books.push(book)
  }
  return books
}