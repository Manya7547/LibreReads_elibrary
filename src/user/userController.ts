import { Express, Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


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

        try {
            const user = await userModel.findOne({email: email});
            if(user){
                const error = createHttpError(400, "user already exists with this email");
                return next(error);
            }
        } catch (err) {
            return next(createHttpError(500,"Error while getting user"));
        }

        

        // hash password 
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser: User;
        try {
            newUser = await userModel.create({
                name, 
                email,
                password: hashedPassword,
            });
        } catch (err) {
            return next(createHttpError(500, "Error while creating user"));
        }
        

        //token generation - JWT token 
        try {
            const token = sign({sub: newUser._id}, config.jwtSecret as string, {
                expiresIn: '7d',
                algorithm: 'HS256',
            });


            //response
            res.status(201).json({accessToken: token}); 

        } catch (err) {
            return next(createHttpError(500, "Error while signing the jwt token"));
        }


    };

    const loginUser = async (
        req: Request, 
        res: Response, 
        next: NextFunction
        ) => {
            const {email, password} = req.body;

            if(!email || !password){
                return next(createHttpError(400,"All fields are required"));
            }

            //handle errors
            const user = await userModel.findOne({email: email});
            
            if(!user)
                return next(createHttpError(404, "User not found"));
                
        
            
            //match email and password with db 
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch)
                return next(createHttpError(400, "Username or password incorrect"));
            
            //if it matches, generate new access token
            const token = sign({sub: user._id}, config.jwtSecret as string, {
                expiresIn: '7d',
                algorithm: 'HS256',
            });
            

            res.json({accessToken: token});
        };
    
export {createUser, loginUser};
