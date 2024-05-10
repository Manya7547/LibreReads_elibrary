import { Express, Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';


const createUser =async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {

        const {name, email, password} = req.body;

        //validation 
        if(!name || !email || !password){
            const error = createHttpError(400,"All fields are required");
            return next(error); //will be passed to global error handler
        }

        //database call 
        const user = await userModel.findOne({email: email});

        if(user){
            const error = createHttpError(400, "user already exists with this email");
            return next(error);
        }

        // hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //process or logic 

        //response

        res.json({message:"user created"});
    };

export {createUser};