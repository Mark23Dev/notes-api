import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { deleteAttachment, getAllNoteAttachments, getAttachment, uploadAttachment } from "../controllers/attachmentController";

const router = express.Router();

// Upload attachment
router.post("/:noteId", authMiddleware, uploadAttachment);

// Get note all attachments
router.get("/:note", authMiddleware, getAllNoteAttachments);

// Get attachment
router.get("/file/:id", authMiddleware, getAttachment);

// Delete attachment
router.delete("/:id", authMiddleware, deleteAttachment);

export default router;
