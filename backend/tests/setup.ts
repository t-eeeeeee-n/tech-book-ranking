import mongoose from 'mongoose'

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  
  // Set test API key for authentication tests
  process.env.API_KEYS = 'test-api-key-123'
  
  // Connect to test database
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI)
  }
})

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close()
})