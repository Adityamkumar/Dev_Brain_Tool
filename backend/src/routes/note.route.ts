import express from 'express'
import { createNote, getAllNotes, searchNote } from '../controllers/note.controller'
const router = express.Router()



router.post('/create', createNote)
router.get('/search', searchNote)
router.get('/allNotes', getAllNotes)

export default router