import express from 'express'
import { createBook, listBooks, updateBook } from "./bookController"
import multer from "multer"
import path from 'node:path';
import authenticate from '../middlewares/authenticate';

const bookRouter = express.Router();

// will store in local file store (temporarily)
const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 3e7 }
})

// routes

//  api/books/
// / -> authenticate (in the end next()) -> middleware of multer -> main req handler (next() 
bookRouter.post(
    '/', 
    authenticate,
upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount: 1},
]), 
createBook);

bookRouter.patch(
    '/:bookId',   //dynamic segment book id 
    authenticate,
upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount: 1},
]), 
updateBook);

bookRouter.get('/', listBooks);   //this is going to be public (not authenticated)




export default bookRouter;