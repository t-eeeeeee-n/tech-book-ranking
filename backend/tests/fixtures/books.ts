import { Book as IBook } from '@/types'

export const mockBookData: Partial<IBook> = {
  title: 'Clean Code',
  author: ['Robert C. Martin'],
  publisher: 'Prentice Hall',
  isbn10: '0132350882',
  isbn13: '9780132350884',
  publishedYear: 2008,
  category: ['programming', 'software-engineering'],
  tags: ['clean-code', 'programming', 'software-development'],
  description: 'A handbook of agile software craftsmanship',
  amazonUrl: 'https://amazon.com/clean-code',
  imageUrl: 'https://example.com/clean-code.jpg'
}

export const mockBookData2: Partial<IBook> = {
  title: 'The Pragmatic Programmer',
  author: ['David Thomas', 'Andrew Hunt'],
  publisher: 'Addison-Wesley',
  isbn10: '020161622X',
  isbn13: '9780201616224',
  publishedYear: 1999,
  category: ['programming'],
  tags: ['pragmatic', 'programming', 'best-practices'],
  description: 'From journeyman to master'
}

export const invalidBookData = {
  // Missing required title
  author: 'Test Author',
  isbn13: 'invalid-isbn', // Invalid format
  publishedYear: 1799, // Too early
  category: [] // Empty array
}

export const duplicateIsbnData: Partial<IBook> = {
  title: 'Another Clean Code Book',
  author: ['Another Author'],
  isbn13: '9780132350884', // Same as mockBookData
  category: ['programming']
}