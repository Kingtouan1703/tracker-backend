import express, { Request, Response } from 'express'
import { priceTrackerController } from '../controllers/index.controller'
import { catchAsync } from '../util'

const router = express.Router()

// Health check route with defined types
router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'API is running successfully!' })
})

// Price Tracker Routes
router.get('/price/:coinId', catchAsync(priceTrackerController.getCurrentPrice))
router.get('/history', catchAsync(priceTrackerController.getHistoryChart))
router.get('/init', catchAsync(priceTrackerController.init))

export default router
