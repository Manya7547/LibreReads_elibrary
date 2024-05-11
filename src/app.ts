import express, { NextFunction } from 'express'
import { Request } from 'express';
import {Response} from 'express';
import createHttpError, {HttpError} from 'http-errors';
import bookRouter from './book/bookRouter';
import { config } from './config/config';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express();
app.use(express.json());


//Routes or URLs

app.get('/',(req, res, next) => {

    const error = createHttpError(400, "something went wrong");
    throw error;
    res.json({message: "Welcome to ELibrary"})

})

//register the router
app.use("/api/users",userRouter);
app.use("/api/books",bookRouter);


//global error handler
app.use(globalErrorHandler);

export default app