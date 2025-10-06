export const createNote = (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  res.status(201).json({ message: "Note created successfully", notes });
}

// Fetch all notes
export const fetchAllNotes = (req, res) => {
  res.status(200).json(notes);
}

//  Get note by ID
export const fetchNoteById = (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = notes.find(note => note.id === noteId);
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
}

//  PUT || update note by ID
export const updateNoteById = (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex] = { ...notes[noteIndex], ...req.body };
    res.status(200).json({ message: "Note updated successfully", notes });
  } else {
    res.status(404).json({ message: "Note not found" });
  }
}

//  DELETE || delete note by ID
export const deleteNoteById = (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.status(200).json({ message: "Note deleted successfully", notes });
  } else {
    res.status(404).json({ message: "Note not found" });
  }
} 
