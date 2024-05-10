import express, { NextFunction } from 'express'
import { Request } from 'express';
import {Response} from 'express';
import createHttpError, {HttpError} from 'http-errors';
import { config } from './config/config';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();


//Routes or URLs

app.get('/',(req, res, next) => {

    const error = createHttpError(400, "something went wrong");
    throw error;
    res.json({message: "Welcome to ELibrary"})

})


//global error handler
app.use(globalErrorHandler);

export default app