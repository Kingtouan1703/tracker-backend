import { NextFunction, Request, Response } from 'express'

function calculateDateDifference(
    date1: string | number | Date,
    date2: string | number | Date
) {
    // Convert to Date objects if they are not already
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error('Invalid date input')
    }

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(d2.getTime() - d1.getTime())

    // Convert milliseconds to days, hours, minutes, and seconds
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
}

const catchAsync = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}

export { calculateDateDifference, catchAsync }
