import { NextFunction, Request, Response } from 'express'

type CustomError = {
    status?: number
} & Error

function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = err.status || 500
    let message = err.message || 'Internal Server Error'

    if (message.includes('429 - Too Many Requests')) {
        statusCode = 429
        message = 'Too Many Requests'
    }

    res.status(statusCode).json({
        success: false,
        message,
    })
}

export { errorHandler }
