import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.")
  process.exit(1)
}

async function testConnection() {
  const client = new MongoClient(uri)
  try {
    console.log("Attempting to connect to MongoDB...")
    await client.connect()
    console.log("Successfully connected to MongoDB!")

    const db = client.db("BlogDB")
    const collections = await db.listCollections().toArray()
    console.log(
      "Collections in BlogDB:",
      collections.map((c) => c.name),
    )

    // Optional: Try to insert a dummy document to test write access
    const testCollection = db.collection("test_connection")
    await testCollection.insertOne({ message: "Test document", timestamp: new Date() })
    console.log("Successfully inserted a test document.")
    await testCollection.deleteOne({ message: "Test document" })
    console.log("Successfully deleted the test document.")
  } catch (error) {
    console.error("Failed to connect to MongoDB or perform operations:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed.")
  }
}

testConnection()
