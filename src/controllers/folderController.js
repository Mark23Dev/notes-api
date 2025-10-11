// Create a new folder --POST
export const createFolder = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.userId;

    try {
        if (!name) {
            return res.status(400).json({ message: "Folder name required"});
        }
        const newFolder = await prisma.folder.create({
            data: { name, userId },
            select: {
                id: true, 
                name: true, 
                userId: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.status(201).json({ message: "Folder successfully created", folder: newFolder });
    } catch (error) {
        console.log("Error creating folder", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// GET all folders
const getAllFolders = async (req, res) =>  {
    try {
        const userId = req.user.userId;

        const folders = await prisma.folder.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(200).json({ message: "Fetched folders successfully", folders });
    } catch (error) {
        console.log("Error fetching folders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// GET folder by id
const getFolderById = async (req, res) => {
    const userId = req.user.userId;
    const folderId = req.params.id;

    try {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId },
            select: {
                id: true,
                name: true,
                userId: true,
                notes: { select: { id: true, title: true, createdAt: true } },
                createdAt: true,
                updatedAt: true
            }
        });

        // Validate when user does not exist
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.status(200).json({ message: "Successfully fetched folder", folder });
    } catch (error) {
        console.log("Error fetching folder:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

// Update folder -- PUT
const updateFolder = async (req, res) => {
    const userId = req.user.userId;
    const folderId = req.params.id;

    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Nothing to update"});
        }

        // Get the folder that is to be updated
        const existingFolder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { user: true },
        });

        if (!existingFolder) {
            return res.status(404).json({ message: "Folder does not exist"});
        }

        if (existingFolder.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to update this folder" })
        }

        const updatedFolder = await prisma.folder.update({
            where: { id: folderId },
            data: { name },
        });
        res.status(200).json({ message: "Folder updated", folder: updatedFolder });
        
    } catch (error) {
        console.log("Error updating folder:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

// Delete folder
const deleteFolder = async (req, res) => {
    const userId = req.user.userId;
    const folderId = req.params.id;

    try {
        const existingFolder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { user: true },
        });

        if (!existingFolder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        if (existingFolder.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this folder" });
        }
        const deletedFolder = await prisma.folder.delete({
            where: { id: folderId }
        });

        res.status(200).json({ message: "Folder successfully deleted" });
    } catch (error) {
        console.log("Error deleting folder", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}