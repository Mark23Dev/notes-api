import express from "express";
import { deleteProfile, getProfile, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

// GET /user/ → fetch user profile.
router.get("/", authMiddleware, getProfile);

// PUT /user/ → update user profile.
router.put("/", authMiddleware, updateProfile);

// DELETE /user/ → delete user profile.
router.delete("/", authMiddleware, deleteProfile);

export default router;