import prisma from "../../prisma/prismaClient.js";

// Upload attachment
export const uploadAttachment = async (req, res) => {
    const { noteId }  = req.params;
    const userId = req.user.userId;
    try {
        const { url, fileName, fileType } = req.body;
        if (!url) {
            return res.status(400).json({ message: "No url provided"});
        }
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            orderBy: { createdAt: 'desc' },
        });
        if (!note ||note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to attach file"})
        }
        const attachment = await prisma.attachment.create({
            data: {
                url,
                fileName,
                fileType,
            }
        })
        res.status(201).json({ message: "Created attachment", attachment});
    } catch (error) {
        console.log("Error uploading an attachment:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }

}

// Get all attachments for the note
export const getAllNoteAttachments = async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user.userId;

    try {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { user: true }
        })
        if (!note || note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to get this attachment" });
        }

        const attachments = await prisma.attachment.findMany({
            where: { noteId },
        });
        res.status(200).json({ message: "Fetched attachments successfully", attachments });
    } catch (error) {
        console.log("Error fetching attachments:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

// Get one attachment
export const getAttachment = async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;

    try {
        const attachment = await prisma.attachment.findUnique({
            where: { id },
            include: { note: true },
        })
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }
        if (attachment.note.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to access this attachment" });
        }
        res.status(200).json({ message: "Fetched attachment", attachment });
    } catch (error) {
        console.log("Error fetching attachment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete attachment
export const deleteAttachment = async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;

    try {
        const attachment = await prisma.attachment.findUnique({
            where: { id },
            include: { note: true },
        });
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }
        if (attachment.note.userId !== userId) {
            return res.status(403).json({ message: "Internal Server Error" });
        }
        const deletedAttachment = await prisma.attachment.delete({
            where: { id }
        });
        res.status(200).json({ message: "Attachment deleted" });
    } catch (error) {
        console.log("Error deleting attachment", error);
        res.status(500).json({ message: "Internal Serve Error" });
    }
}