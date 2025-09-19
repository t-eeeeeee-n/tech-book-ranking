import * as dotenv from 'dotenv'

// Set test environment variables BEFORE importing the service
process.env.AMAZON_ACCESS_KEY = 'test-access-key'
process.env.AMAZON_SECRET_KEY = 'test-secret-key'
process.env.AMAZON_ASSOCIATE_TAG = 'test-associate-tag'
process.env.AMAZON_REGION = 'us-east-1'
process.env.AMAZON_ENDPOINT = 'webservices.amazon.com'

import { AmazonApiService } from '@/services/amazonApiService'

// Mock axios to avoid making real API calls in tests
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn()
  }))
}))

import axios from 'axios'
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AmazonApiService', () => {
  let amazonService: AmazonApiService
  let originalEnv: NodeJS.ProcessEnv

  beforeAll(() => {
    // Save original environment
    originalEnv = { ...process.env }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks()
    
    // Create new service instance
    amazonService = new AmazonApiService()
  })

  describe('Constructor and Credential Loading', () => {
    it('should load credentials from environment variables', () => {
      expect(() => new AmazonApiService()).not.toThrow()
    })

    it('should throw error when credentials are missing', () => {
      const savedAccessKey = process.env.AMAZON_ACCESS_KEY
      delete process.env.AMAZON_ACCESS_KEY

      expect(() => new AmazonApiService()).toThrow('Amazon API credentials are not properly configured')

      // Restore for other tests
      process.env.AMAZON_ACCESS_KEY = savedAccessKey
    })
  })

  describe('ISBN to ASIN Conversion', () => {
    it('should convert valid ISBN-13 starting with 978', () => {
      // Access private method for testing (using any to bypass TypeScript)
      const isbn = '978-0-13-235088-4'
      const asin = (amazonService as any).isbnToAsin(isbn)
      expect(asin).toBe('9780132350884')
    })

    it('should convert valid ISBN-13 starting with 979', () => {
      const isbn = '979-1-23456-789-0'
      const asin = (amazonService as any).isbnToAsin(isbn)
      expect(asin).toBe('9791234567890')
    })

    it('should handle ISBN-13 without hyphens', () => {
      const isbn = '9780132350884'
      const asin = (amazonService as any).isbnToAsin(isbn)
      expect(asin).toBe('9780132350884')
    })

    it('should throw error for invalid ISBN-13 format', () => {
      const invalidIsbn = '123456789012'
      expect(() => (amazonService as any).isbnToAsin(invalidIsbn)).toThrow('Invalid ISBN-13 format')
    })

    it('should throw error for ISBN-13 not starting with 978 or 979', () => {
      const invalidIsbn = '9770132350884'
      expect(() => (amazonService as any).isbnToAsin(invalidIsbn)).toThrow('Invalid ISBN-13 format')
    })
  })

  describe('getBookByIsbn', () => {
    it('should return book data for successful API response', async () => {
      const mockResponse = {
        ItemsResult: {
          Items: [{
            ASIN: '9780132350884',
            DetailPageURL: 'https://amazon.com/dp/9780132350884',
            ItemInfo: {
              Title: {
                DisplayValue: 'Clean Code: A Handbook of Agile Software Craftsmanship'
              },
              ByLineInfo: {
                Contributors: [
                  { Name: 'Robert C. Martin', Role: 'Author' }
                ]
              },
              ContentInfo: {
                PublicationDate: {
                  DisplayValue: '2008-08-01'
                }
              },
              Classifications: {
                Binding: {
                  DisplayValue: 'Paperback'
                }
              },
              ExternalIds: {
                EANs: {
                  DisplayValues: ['9780132350884']
                },
                ISBNs: {
                  DisplayValues: ['0132350882']
                }
              }
            },
            Images: {
              Primary: {
                Large: {
                  URL: 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SL1600_.jpg'
                }
              }
            },
            Offers: {
              Listings: [{
                Price: {
                  Amount: 2999,
                  Currency: 'USD',
                  DisplayAmount: '$29.99'
                },
                Availability: {
                  Message: 'In Stock'
                }
              }]
            }
          }]
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.getBookByIsbn('9780132350884')

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        authors: ['Robert C. Martin'],
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SL1600_.jpg',
        amazonUrl: 'https://amazon.com/dp/9780132350884',
        price: {
          amount: 2999,
          currency: 'USD',
          displayAmount: '$29.99'
        },
        isbn10: '0132350882',
        isbn13: '9780132350884',
        asin: '9780132350884',
        publisher: undefined,
        publicationDate: '2008-08-01',
        availability: 'In Stock',
        binding: 'Paperback'
      })
    })

    it('should handle API errors gracefully', async () => {
      const mockErrorResponse = {
        Errors: [{
          Code: 'InvalidParameterValue',
          Message: 'The ItemId provided is invalid'
        }]
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockErrorResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.getBookByIsbn('9780132350884')

      expect(result.success).toBe(false)
      expect(result.error).toBe('InvalidParameterValue')
      expect(result.message).toBe('The ItemId provided is invalid')
    })

    it('should handle books not found', async () => {
      const mockEmptyResponse = {
        ItemsResult: {
          Items: []
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockEmptyResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.getBookByIsbn('9780132350884')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Book not found on Amazon')
    })

    it('should handle network errors', async () => {
      const mockAxiosInstance = {
        post: jest.fn().mockRejectedValue(new Error('Network error'))
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.getBookByIsbn('9780132350884')

      expect(result.success).toBe(false)
      expect(result.error).toBe('API_ERROR')
      expect(result.message).toContain('Network error')
    })

    it('should handle invalid ISBN format', async () => {
      const result = await amazonService.getBookByIsbn('invalid-isbn')

      expect(result.success).toBe(false)
      expect(result.error).toBe('API_ERROR')
      expect(result.message).toContain('Invalid ISBN-13 format')
    })
  })

  describe('searchBooks', () => {
    it('should return search results for title and author', async () => {
      const mockResponse = {
        SearchResult: {
          Items: [{
            ASIN: 'B123456789',
            DetailPageURL: 'https://amazon.com/dp/B123456789',
            ItemInfo: {
              Title: {
                DisplayValue: 'JavaScript: The Good Parts'
              },
              ByLineInfo: {
                Contributors: [
                  { Name: 'Douglas Crockford', Role: 'Author' }
                ]
              }
            },
            Images: {
              Primary: {
                Large: {
                  URL: 'https://images-na.ssl-images-amazon.com/images/I/test.jpg'
                }
              }
            },
            Offers: {
              Listings: [{
                Price: {
                  Amount: 1999,
                  Currency: 'USD',
                  DisplayAmount: '$19.99'
                }
              }]
            }
          }]
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.searchBooks('JavaScript', 'Douglas Crockford')

      expect(result.success).toBe(true)
      expect(result.data?.title).toBe('JavaScript: The Good Parts')
      expect(result.data?.authors).toEqual(['Douglas Crockford'])
    })

    it('should handle search with title only', async () => {
      const mockResponse = {
        SearchResult: {
          Items: [{
            ASIN: 'B123456789',
            DetailPageURL: 'https://amazon.com/dp/B123456789',
            ItemInfo: {
              Title: {
                DisplayValue: 'Clean Code'
              }
            }
          }]
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.searchBooks('Clean Code')

      expect(result.success).toBe(true)
      expect(result.data?.title).toBe('Clean Code')
    })

    it('should handle no search results', async () => {
      const mockEmptyResponse = {
        SearchResult: {
          Items: []
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockEmptyResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.searchBooks('Non-existent Book')

      expect(result.success).toBe(false)
      expect(result.message).toBe('No books found matching the search criteria')
    })
  })

  describe('normalizeAmazonResponse', () => {
    it('should normalize response with all fields', () => {
      const mockItem = {
        ASIN: 'TEST123',
        DetailPageURL: 'https://amazon.com/dp/TEST123',
        ItemInfo: {
          Title: { DisplayValue: 'Test Book' },
          ByLineInfo: {
            Contributors: [
              { Name: 'John Doe', Role: 'Author' },
              { Name: 'Jane Smith', Role: 'Author' },
              { Name: 'Bob Editor', Role: 'Editor' }
            ]
          },
          ContentInfo: {
            PublicationDate: { DisplayValue: '2023-01-01' }
          },
          Classifications: {
            Binding: { DisplayValue: 'Hardcover' }
          },
          ExternalIds: {
            EANs: { DisplayValues: ['9781234567890'] },
            ISBNs: { DisplayValues: ['1234567890'] }
          }
        },
        Images: {
          Primary: {
            Large: { URL: 'https://example.com/image.jpg' }
          }
        },
        Offers: {
          Listings: [{
            Price: {
              Amount: 2599,
              Currency: 'USD',
              DisplayAmount: '$25.99'
            },
            Availability: { Message: 'In Stock' }
          }]
        }
      }

      const normalized = (amazonService as any).normalizeAmazonResponse(mockItem)

      expect(normalized).toEqual({
        title: 'Test Book',
        authors: ['John Doe', 'Jane Smith'], // Only authors, not editors
        imageUrl: 'https://example.com/image.jpg',
        amazonUrl: 'https://amazon.com/dp/TEST123',
        price: {
          amount: 2599,
          currency: 'USD',
          displayAmount: '$25.99'
        },
        isbn10: '1234567890',
        isbn13: '9781234567890',
        asin: 'TEST123',
        publisher: undefined,
        publicationDate: '2023-01-01',
        availability: 'In Stock',
        binding: 'Hardcover'
      })
    })

    it('should handle missing fields gracefully', () => {
      const mockItem = {
        ASIN: 'TEST123',
        ItemInfo: {
          Title: { DisplayValue: 'Minimal Book' }
        }
      }

      const normalized = (amazonService as any).normalizeAmazonResponse(mockItem)

      expect(normalized).toEqual({
        title: 'Minimal Book',
        authors: undefined,
        imageUrl: undefined,
        amazonUrl: undefined,
        price: undefined,
        isbn10: undefined,
        isbn13: undefined,
        asin: 'TEST123',
        publisher: undefined,
        publicationDate: undefined,
        availability: undefined,
        binding: undefined
      })
    })
  })

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      const mockResponse = {
        ItemsResult: {
          Items: [{
            ASIN: '9780132350884',
            ItemInfo: {
              Title: { DisplayValue: 'Clean Code' }
            }
          }]
        }
      }

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue({ data: mockResponse })
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.testConnection()
      expect(result).toBe(true)
    })

    it('should return false for failed connection', async () => {
      const mockAxiosInstance = {
        post: jest.fn().mockRejectedValue(new Error('Connection failed'))
      }
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any)

      const result = await amazonService.testConnection()
      expect(result).toBe(false)
    })
  })

  describe('AWS Signature V4', () => {
    it('should generate valid signature components', () => {
      const timestamp = '20230101T120000Z'
      const method = 'POST'
      const uri = '/'
      const queryString = ''
      const headers = {
        'Host': 'webservices.amazon.com',
        'X-Amz-Date': timestamp,
        'Content-Type': 'application/json'
      }
      const payload = '{"test": "data"}'
      const region = 'us-east-1'

      // Test that signature generation doesn't throw
      expect(() => {
        (amazonService as any).generateSignature(
          method, uri, queryString, headers, payload, timestamp, region
        )
      }).not.toThrow()
    })
  })
})