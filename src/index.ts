import express from 'express'
import router from './routers/index.router'
import cors from 'cors'
import { errorHandler } from './middlewares/index.middlewares'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/v1', router)
app.use(errorHandler)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
