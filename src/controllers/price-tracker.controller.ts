import { Request, Response } from 'express'
import { priceTrackerService } from '../services/index.service'

class PriceTrackerController {
    async getCurrentPrice(req: Request, res: Response) {
        const { coinId } = req.params
        const price = await priceTrackerService.getCurrentPrice(coinId)

        res.status(200).json({ data: price })
    }

    async getHistoryChart(req: Request, res: Response) {
        const { coinId, from, limit } = req.query

        const histories = await priceTrackerService.getHistoryDataBySymbol(
            String(coinId),
            Number(from),
            Number(limit)
        )
        res.status(200).json({ data: histories })
    }

    async init(req: Request, res: Response) {
        await priceTrackerService.init()
        res.status(200).json({ data: 'init success' })
    }
}

export const priceTrackerController = new PriceTrackerController()
