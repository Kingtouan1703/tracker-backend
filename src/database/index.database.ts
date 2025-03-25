import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./src/database/database.db', (error) => {
    console.log({ error })
    console.log('Connected to SQLite database')
})

db.serialize(() => {
    db.run(
        `
      CREATE TABLE IF NOT EXISTS coins (
        coin_id VARCHAR(8) PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        symbol VARCHAR(8) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
        (err) => {
            if (err) {
                console.error('Error creating table:', err.message)
            } else {
                console.log('coins table created/exists')
            }
        }
    )

    db.run(
        `
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin_id VARCHAR(8) NOT NULL,
        time BIGINT NOT NULL,
        price TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coin_id) REFERENCES coins(coin_id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS coin_id_time
      ON history (coin_id, time);
    `,
        (err) => {
            if (err) {
                console.error('Error creating history table:', err.message)
            } else {
                console.log('History table created/exists')
            }
        }
    )
})

export { db }
