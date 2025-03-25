import axios from 'axios'
import { config } from '../config'

type BasicCoin = {
    id: string
    name: string
    symbol: string
}
type Price = [number, number]
type MarketCap = Price
type TotalVolumes = Price

type PriceChartResponse = {
    prices: Price[]
    market_caps: MarketCap[]
    total_volumes: TotalVolumes[]
}

class ConGeckoService {
    private baseUrl = config.coinGecko.baseApi

    private async fetchData<T = unknown>(
        endpoint: string,
        params: Record<string, string> = {}
    ) {
        const url = new URL(`${this.baseUrl}/${endpoint}`)
        Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, value)
        )

        try {
            const response = await axios.get<T>(url.href);
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async coinList() {
        return this.fetchData<BasicCoin[]>('coins/list', {
            include_platform: 'false',
        })
    }

    async coinChartDataById(coinId: string, days = '365') {
        return this.fetchData<PriceChartResponse>(
            `coins/${coinId}/market_chart`,
            {
                vs_currency: config.defaultCurrency,
                days: days,
                interval: 'daily',
            }
        )
    }

    async coinPriceById(coinId: string, vsCurrencies: string) {
        return this.fetchData('simple/price', {
            ids: coinId,
            vs_currencies: vsCurrencies,
            precision: config.precision.toString(),
        })
    }
}

const coinGeckoService = new ConGeckoService()

export { coinGeckoService, ConGeckoService, BasicCoin }
