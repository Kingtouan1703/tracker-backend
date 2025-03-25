import { priceTrackerService } from '../services/tracker.service'

async function seedDatabase() {
    try {
        console.log('Seeding database...')
        await priceTrackerService.init()
        console.log('Database seeded successfully!')
        process.exit(0)
    } catch (error) {
        console.error('Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()
