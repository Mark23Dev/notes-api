import express from "express";
import { createFolder, deleteFolder, getAllFolders, getFolderById, updateFolder } from "../controllers/folderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// Create folder
router.post("/", authMiddleware, createFolder);

// Get all folders
router.get("/", authMiddleware, getAllFolders );

// Create folder by id
router.get("/:id", authMiddleware, getFolderById);

// Update folder
router.put("/:id", authMiddleware, updateFolder);

// Delete folder
router.delete("/:id", authMiddleware, deleteFolder);

export default router;
