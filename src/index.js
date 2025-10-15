import express from 'express'
import authRoutes from './routes/authRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import userRoutes from './routes/userRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import attachmentRoutes from './routes/attachmentRoutes.js';
import tagRoutes from './routes/tagsRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



//  Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('api/attachments', attachmentRoutes);
app.use('/api/tags', tagRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
