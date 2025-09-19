import mongoose from 'mongoose'

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  
  // Set test API key for authentication tests
  process.env.API_KEYS = 'test-api-key-123'
  
  // Connect to test database
  const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
  await mongoose.connect(mongoUrl)
})

beforeEach(async () => {
  // Clear all collections before each test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      await collections[key].deleteMany({})
    }
  }
})

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close()
})