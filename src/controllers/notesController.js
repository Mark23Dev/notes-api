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
  try{
    const userId = req.user.userId;

    const notes = await prisma.notes.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: { tag: true },
        },
        attachments: true,
        folder: true,
      }
    });

    res.status(200).json(notes);
  } catch (error) {
    console.log("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error"});
  }
}

//  Get note by ID
export const fetchNoteById = async (req, res) => {
  const userId = req.user.userId;
  const noteId = parseInt(req.params.id)

  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
      include: {
        tags: {
          include: { tag: true }
        },
        attachments: true,
        folder: true,
      }
    })
    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }
  
    res.status(200).json(note)
  } catch (error) {
    console.log("Error fetching a note:", error);
    res.status(500).json("Internal Server error")
  }
}

//  PUT || update note by ID
export const updateNoteById = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  
  try {
    const { title, content, folderId, isFavorite, isArchived } = req.body;

    // Check if there's any field being updated
    const hasUpdates = ['title', 'content', 'folderId', 'isFavorite', 'isArchived'].some(key=>Object.prototype.hasOwnProperty.call(req.body, key))

    if (!hasUpdates) {
      return res.status(400).json({ message: "Nothing to update!" })
    }

    // Fetch existing user
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
      include: { user: true }
    })

    // Validate the note being updated -- Checkif it exists and belongs to the user
    if (!existingNote) {
      return res.status(404).json({message: "Note does not exist" });
    }
    if (existingNote.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this note" })
    }

    // Folder validation
    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId }
      })
      if (!folder || folder.userId !== userId) {
        return res.status(400).json({ message: "Invalid folder" });
      }
    }

    // Update note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(folderId && { folderId }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isArchived !== undefined && { isArchived }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        folderId: true,
        isFavorite: true,
        isArchived: true,
        updatedAt: true
      }
    })
    res.status(200).json({ note: updatedNote })
  } catch (error) {
    console.log("Error updating a note:", error);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

//  DELETE || delete note by ID
export const deleteNoteById = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  try {
    await prisma.$transaction(async (tx)=>{
      // Fetch existng note that's supposed to be deleted
      const existingNote = await tx.note.findUnique({
        where: { id: noteId },
        include: { user: { include: { trashFolder: true }} }
      })
      // validate if the note exists and belongs to the user
      if (!existingNote || existingNote.userId !== userId) {
        throw new Error("Note does not exist")
      }

      // Get trashFolderId
      const trashFolderId = existingNote.user.trashFolder?.id;
      if (!trashFolderId){
        throw new Error("Trash folder not found for this user")
      }

      // Delete note -- Move it to the trash folder
      await tx.deletedNote.create({
        data: {
          title: existingNote.title,
          content: existingNote.content,
          userId: existingNote.userId,
          trashFolderId,
        }
      });

      // Clear deleted note from the notes table
      await tx.note.delete({
        where: { id: noteId }
      });
    });
    res.status(200).json({ message: "Note moved to trash" });
  } catch (error) {
    console.log("Error deleting a note:", error);
    res.status(500).json({ message: "Internal Server Error"});
  }
} 
