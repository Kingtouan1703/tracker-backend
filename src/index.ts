import express from 'express'
import router from './routers/index.router'
import cors from 'cors'
import { errorHandler } from './middlewares/index.middlewares'
import { config } from './config'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/v1', router)
app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
