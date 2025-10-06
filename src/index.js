import express from 'express'
import authRoutes from './routes/authRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



//  Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/user', userRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
