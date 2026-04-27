import express from 'express'
import { createNote, deleteNotes, getAllNotes, searchNote } from '../controllers/note.controller'
const router = express.Router()



router.post('/create', createNote)
router.get('/search', searchNote)
router.get('/allNotes', getAllNotes)
router.delete('/:id', deleteNotes)

export default router