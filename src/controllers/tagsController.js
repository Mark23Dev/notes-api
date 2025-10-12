import prisma from "../../prisma/prismaClient.js";

// Create note tag
export const createTag = async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user.userId;
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Tag name required" })
        }
        // Get the note
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { user: true },
        });
        if (!note || note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        // Check if th tag already exists for the user
        let tag = await prisma.tag.findFirst({
            where: { name, userId }
        });

        // If tag doesn't exist, create one
        if (!tag) {
            tag = await prisma.tag.create({
                data: { name, userId }
            });
        }

        // Link the tag to note *avoid duplicates
        const noteTag = await prisma.noteTag.upsert({
            where: {
                noteId_tagId: { noteId: note.id, tagId: tag.id }
            },
            update: {},
            create: { noteId: note.id, tagId: tag.id },
        });
        res.status(201).json({ message: "Tag created or linked successfully", tag });
    } catch (error) {
        console.log("Error creating tag", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all tags
export const fetchAllTags = async (req, res) => {
    const { userId } = req.user;

    try {
        // get the tags
        const tags = await prisma.tag.findMany({
            where: { userId },
        });

        res.status(200).json({ message: "Tags fetched successfully", tags });
    } catch (error) {
        console.log("Error fetching tags", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Fetch all tags for a specific note
export const fetchAllNoteTags = async (req, res) => {
    const { userId } = req.user;
    const { noteId } = req.params;

    try {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { tags: true }
        });
        if (!note || note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        res.status(200).json({ message: "Fetched note tags successfully", tags: note.tags })
    } catch (error) {
        console.log("Error fetching note tags:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// Remove tag from note
export const deleteTagFromNote = async (req, res) => {
    const { noteId } = req.params;
    const { userId } = req.user;
    const { name } = req.body;

    try {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { user: true }
        });
        if (!note || note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!name) {
            return res.status(400).json({ message: "Tag name required" });
        }

        // Get the tag
        const tag = await prisma.tag.findFirst({
            where: { name, userId }
        });

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        // Remove the connection
        const deletedNoteTag = await prisma.noteTag.delete({
            where: { 
                noteId_tagId: {
                    noteId: note.id,
                    tagId: tag.id
                }
            }
        });

        res.status(200).json({ message: "Tag removed from note successfully" });
    } catch (error) {
        console.log("Error deleting note tag:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}