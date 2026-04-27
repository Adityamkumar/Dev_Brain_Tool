import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
   res.send("Hello From Server✅")
})

import noteRouter from './routes/note.route.js'
app.use('/api/note', noteRouter)

export default app