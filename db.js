import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('strictQuery', true)

async function dbClose() {
    await mongoose.connection.close()
    console.log('Database disconnected!')
}

// Connect to a MongoDB via Mongoose
try {
    const m = await mongoose.connect(process.env.ATLAS_DB_URL)
    console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect')
}
    catch(err) { console.log(err)}

// Create a Mongoose schema to define the structure of a model
const entrySchema = new mongoose.Schema({
    category: { type: mongoose.ObjectId, ref: 'Category' },
    content: { type: String, required: true }
})

// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)

// Categories
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }
})

const CategoryModel = mongoose.model('Category', categorySchema)

export { EntryModel, CategoryModel, dbClose }