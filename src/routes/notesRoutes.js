import express from "express"
import { createNote, deleteNoteById, fetchAllNotes, fetchNoteById, updateNoteById } from "../controllers/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /notes → create a note.
router.post("/", authMiddleware,  createNote)

// GET /notes → fetch all notes.
router.get("/", authMiddleware, fetchAllNotes)

// GET /notes/:id → fetch one note.
router.get("/:id", authMiddleware, fetchNoteById)

// PUT /notes/:id → update a note.
router.put("/:id", authMiddleware, updateNoteById)

// DELETE /notes/:id → delete a note.
router.delete("/:id", authMiddleware, deleteNoteById)

export default router