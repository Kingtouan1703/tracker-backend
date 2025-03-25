import 'dotenv/config'

const config = {
    coinGecko: {
        apiKey: process.env.COIN_GECKO_API_KEY,
        baseApi: 'https://api.coingecko.com/api/v3',
    },
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'usd',
    precision: 18,
    createManyChunkSize: 1000,
}
export { config }
