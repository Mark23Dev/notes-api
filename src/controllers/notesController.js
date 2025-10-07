export const createNote = async (req, res) => {
  const userId = req.user.userId;
  const { title, content, folderId, tags, attachents, isFavorite } = req.body;

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  const note = await prisma.note.create({
    data: {
      title,
      content,
      folderId,
      userId,
      isFavorite: isFavorite || false,
      tags: tags? {
        create: tags.map((tag)=> ({
          tag: {
            connectOrCreate: {
              where: { name: tag},
              create: { name: tag }
            }
          }
        }))
      }: undefined,
      attachents: attachents ? {
        create: attachments.map((file)=> ({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
        })),
      } : undefined,
      include: {
        tags: true,
        attachments: true,
      },
    }
  })
  res.status(201).json({ message: "Note created successfully", note });
}

// Fetch all notes
export const fetchAllNotes = async (req, res) => {
  const userId = req.user.userId;

  const notes = await prisma.notes
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
