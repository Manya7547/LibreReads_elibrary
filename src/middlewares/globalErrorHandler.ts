import {HttpError} from 'http-errors';
import {Request, Response } from 'express'
import { config } from '../config/config';



const globalErrorHandler = (err: HttpError, req: Request, res: Response) => {
    
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === 'development' ? err.stack : "", // for security 
    })

}

export default globalErrorHandler;