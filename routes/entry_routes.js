import express from "express"
import { EntryModel } from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => res.send(await EntryModel.find().populate('category', 'name')))

router.get('/:id', async (req, res) => {
    try {
        const entry = await EntryModel.findById(req.params.id).populate('category', 'name')
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

// Update
router.put('/:id', async (req, res) => {
    const { category, content } = req.body
    const newEntry = { category, content }

    try {
        const entry = await EntryModel.findByIdAndUpdate(req.params.id, newEntry, { returnDocument: 'after'})
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

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const entry = await EntryModel.findByIdAndDelete(req.params.id)
        if (entry) {
            res.sendStatus(204)
        } else {
            res.status(404).send({ error: 'Entry not found'})
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message})
    }
})


router.post('/', async (req, res) => {
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

export default router