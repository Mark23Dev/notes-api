import express from "express"

const router = express.Router();

const notes = [{
  id: 1, title: "Sample Note", content: "This is a sample note."
}, {
  id: 2, title: "Another Note", content: "This is another note."
}
]; // This would typically be a database

// POST /notes → create a note.
router.post("/", (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  res.status(201).json({ message: "Note created successfully", notes });
})

// GET /notes → fetch all notes.
router.get("/", (req, res) => {
  res.status(200).json(notes);
})

// GET /notes/:id → fetch one note.
router.get("/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = notes.find(note => note.id === noteId);
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
})

// PUT /notes/:id → update a note.
router.put("/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex] = { ...notes[noteIndex], ...req.body };
    res.status(200).json({ message: "Note updated successfully", notes });
  } else {
    res.status(404).json({ message: "Note not found" });
  }
})

// DELETE /notes/:id → delete a note.

export default router