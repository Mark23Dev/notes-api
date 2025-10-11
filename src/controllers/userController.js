import prisma from "../../prisma/prismaClient"

// Get User Profile
export const getProfile = async (req, res) => {
  try { 
    const user = await prisma.user.findUnique({ where: { id: req.user.userId },
      select: { id: true, name: true, email: true, createdAt: true } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error fetching profile: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    // Check if email is taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
    data: { ...(name && { name }), ...(email && { email }) },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.log(`Error updating profile: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Soft delete user and associated data - notes, folders, etc.
export const deleteProfile = async (req, res) =>{
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user and cascade delete associated data
    await prisma.user.delete({ where: { id: userId } });

    // Clear auth cookie
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    
    res.status(200).json({ message: "User and associated data deleted" });
  } catch (error) {
    console.log(`Error deleting profile: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}