import { config } from '../config'
import { db } from '../database/index.database'
import { BasicCoin } from '../services/coingecko.service'

type CoinRecord = { created_at: string; coinId: string } & BasicCoin

class CoinRepository {
    // Create a new coin
    createCoin(coin: BasicCoin) {
        return this.createMany([coin])
    }

    // Get a coin by symbol
    getCoinById(id: string) {
        return new Promise<CoinRecord>((resolve, reject) => {
            db.get(
                `SELECT coin_id as coinId, name, symbol, created_at FROM coins WHERE coin_id = ?`,
                [id],
                (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row as CoinRecord)
                    }
                }
            )
        })
    }

    // Create new coins
    createMany(coins: BasicCoin[]) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(coins) || coins.length === 0) {
                return reject(
                    new Error('Invalid input: coins must be a non-empty array.')
                )
            }

            const chunks: BasicCoin[][] = []
            for (let i = 0; i < coins.length; i += config.createManyChunkSize) {
                chunks.push(coins.slice(i, i + config.createManyChunkSize))
            }

            const runInsert = (chunk: BasicCoin[]) => {
                return new Promise((resolve, reject) => {
                    const placeholders = chunk.map(() => '(?, ?, ?)').join(', ')
                    const values = chunk.flatMap((coin) => [
                        coin.id,
                        coin.name,
                        coin.symbol,
                    ])

                    db.run(
                        `INSERT INTO coins (coin_id, name, symbol) VALUES ${placeholders}`,
                        values,
                        function (err) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(this.changes)
                            }
                        }
                    )
                })
            }

            // Process all chunks
            Promise.all(chunks.map(runInsert))
                .then((results) => {
                    resolve({
                        message: 'Coins added successfully',
                    })
                })
                .catch((err) => reject(err))
        })
    }
}

const coinRepository = new CoinRepository()
export { coinRepository }
