import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'test-techbook-ranking'
    }
  })
  
  const uri = instance.getUri()
  process.env.MONGODB_URI = uri
  ;(global as any).__MONGOINSTANCE = instance
}