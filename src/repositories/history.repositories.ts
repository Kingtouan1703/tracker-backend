import { config } from '../config'
import { db } from '../database/index.database'

type HistoryRecord = {
    coinId: string
    time: Date
    price: string
}

class HistoryRepository {
    getLastHistoryByCoinId(id: string) {
        return new Promise<HistoryRecord>((resolve, reject) => {
            db.get(
                `SELECT coin_id as coinId, time, price FROM history WHERE coin_id = ? ORDER BY time DESC LIMIT 1`,
                [id],
                (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row as HistoryRecord)
                    }
                }
            )
        })
    }

    getLimitHistoryRecords(
        id: string,
        from: string | Date | number,
        limit: number
    ) {
        return new Promise<HistoryRecord[]>((resolve, reject) => {
            db.all(
                `SELECT coin_id as coinId,  strftime('%Y-%m-%d', time / 1000, 'unixepoch') AS time, CAST(price AS REAL) AS value  FROM history WHERE coin_id = ? AND time <= ? ORDER BY time ASC LIMIT ?`,
                [id, from, limit],
                (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row as HistoryRecord[])
                    }
                }
            )
        })
    }

    createMany(records: HistoryRecord[]) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(records) || records.length === 0) {
                return reject(
                    new Error(
                        'Invalid input: HistoryRecord must be a non-empty array.'
                    )
                )
            }

            const chunks = []
            for (
                let i = 0;
                i < records.length;
                i += config.createManyChunkSize
            ) {
                chunks.push(records.slice(i, i + config.createManyChunkSize))
            }

            const runInsert = (chunk: HistoryRecord[]) => {
                return new Promise((resolve, reject) => {
                    const placeholders = chunk.map(() => '(?, ?, ?)').join(', ')
                    const values = chunk.flatMap((history) => [
                        history.coinId,
                        history.time,
                        history.price,
                    ])

                    db.run(
                        `INSERT INTO history (coin_id, time, price) VALUES ${placeholders}`,
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
                        message: 'History added successfully',
                    })
                })
                .catch((err) => reject(err))
        })
    }
}

const historyRepository = new HistoryRepository()
export { historyRepository }
