import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTag, deleteTagFromNote, fetchAllNoteTags, fetchAllTags } from "../controllers/tagsController.js";

const router = express.Router();

// Create note tag
router.post("/", authMiddleware, createTag);

// Get all tags
router.get("/", authMiddleware, fetchAllTags);

// Fetch all note tags
router.get("/:noteId", authMiddleware, fetchAllNoteTags);

// Remove a tag from a note
router.delete("/:noteId", authMiddleware, deleteTagFromNote);

export default router;