import { config } from '../config'
import { coinRepository } from '../repositories/coin.repositories'
import { historyRepository } from '../repositories/history.repositories'
import { calculateDateDifference } from '../util'
import { coinGeckoService } from './coingecko.service'

class PriceTrackerService {
    async init() {
        const rawCoinList = await coinGeckoService.coinList()
        await coinRepository.createMany(rawCoinList)
    }
    async getCoinByCoinId(coinId: string) {
        const coin = await coinRepository.getCoinById(coinId.toLowerCase())
        if (!coin) {
            throw new Error("Your coin hasn't been supported")
        }
        return coin
    }

    async getCurrentPrice(coinId: string) {
        const coin = await this.getCoinByCoinId(coinId)
        const rawCoinPrice = coinGeckoService.coinPriceById(
            coin.coinId,
            config.defaultCurrency
        )
        const currentPrice = rawCoinPrice
        return currentPrice
    }

    async getHistoryDataBySymbol(
        id: string,
        from: string | Date | number,
        limit: number
    ) {
        const coinRecord = await this.getCoinByCoinId(id)
        const { coinId } = coinRecord

        let lastHistory = await historyRepository.getLastHistoryByCoinId(coinId)
        if (!lastHistory) {
            lastHistory = await this.insertHistoryRecords(coinId)
            console.log({ lastHistory })
        }

        const { days } = calculateDateDifference(from, lastHistory.time)
        if (days === 0 || days < 0) {
            return historyRepository.getLimitHistoryRecords(coinId, from, limit)
        }
        if (days > 0) {
            await this.insertHistoryRecords(coinId, Math.floor(days).toString())
            return historyRepository.getLimitHistoryRecords(coinId, from, limit)
        }
    }

    async insertHistoryRecords(coinId: string, days = '365') {
        const { prices } = await coinGeckoService.coinChartDataById(
            coinId,
            days
        )
        const historyRecords = prices.map((price) => ({
            coinId,
            time: new Date(price[0]),
            price: String(price[1]),
        }))
        console.log({ historyRecords })
        await historyRepository.createMany(historyRecords)
        return historyRecords[historyRecords.length - 1]
    }
}
const priceTrackerService = new PriceTrackerService()
export { priceTrackerService, PriceTrackerService }
