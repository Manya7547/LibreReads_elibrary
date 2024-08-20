// creating a router for User 

import express from 'express'
import { createUser, loginUser }  from "./userController"

const userRouter = express.Router();

// routes  
// createUser and loginUser are request handlers 

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);


export default userRouter;