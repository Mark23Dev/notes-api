import express from "express"
import { createNote, deleteNoteById, fetchAllNotes, fetchNoteById, updateNoteById } from "../controllers/notesController.js";

const router = express.Router();

// POST /notes → create a note.
router.post("/",  createNote)

// GET /notes → fetch all notes.
router.get("/", fetchAllNotes)

// GET /notes/:id → fetch one note.
router.get("/:id", fetchNoteById)

// PUT /notes/:id → update a note.
router.put("/:id", updateNoteById)

// DELETE /notes/:id → delete a note.
router.delete("/:id", deleteNoteById)

export default router