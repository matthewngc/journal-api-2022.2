import express from "express"
import mongoose from 'mongoose'

const categories = ['Food', 'Coding', 'Work', 'Other']

const entries = [
    { category: 'Food', content: 'Hello!' },
    { category: 'Coding', content: 'Express is cool!' },
    { category: 'Work', content: 'Another day at the office' }
]

// Connect to a MongoDB via Mongoose
mongoose.connect('mongodb+srv://adminuser:admin123@cluster0.mltb3yf.mongodb.net/journal?retryWrites=true&w=majority')
    .then((m) => console.log(m.connection.readyState === 1 ? 'Mongoose connected!' : 'Mongoose failed to connect'))
    .catch((err) => console.log(err))

// Create a Mongoose schema to define the structure of a model
const entrySchema = new mongoose.Schema({
    category: { type: String, required: true },
    content: { type: String, required: true }
})

// Create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)

const app = express()
const port = 4001

app.use(express.json())

app.get('/', (request, response) => response.send({ info: 'Journal API'}))

app.get('/categories', (req, res) => res.send(categories))

app.get('/entries', async (req, res) => res.send(await EntryModel.find()))

app.get('/entries/:id', async (req, res) => {
    try {
        const entry = await EntryModel.findById(req.params.id)
        if (entry) {
            res.send(entry)
        } else {
            res.status(404).send({ error: 'Entry not found'})
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message})
    }
})

app.post('/entries', async (req, res) => {
    try {
    // 1. Create a new entry object with values passed in from the request
    const { category, content } = req.body
    // Validation/sanitization
    const newEntry = { category, content }
    // 2. Push the new entry to the entries array
    // entries.push(newEntry)
    const insertedEntry = await EntryModel.create(newEntry)
    // 3. Send the new entry with 201 status
    res.status(201).send(insertedEntry)
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
})

app.listen(port, () => console.log(`App running at http://localhost:${port}/`))
