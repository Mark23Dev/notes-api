import express from 'express'
import authRoutes from './routes/authRoutes.js'
import notesRoutes from './routes/notesRoutes.js'

const app = express();
const port = 3003

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/notes', notesRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
