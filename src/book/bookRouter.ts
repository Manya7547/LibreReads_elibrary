import express from 'express'
import { createBook, deleteBook, getSingleBook, listBooks, updateBook } from "./bookController"
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

// get list of books
bookRouter.get("/", listBooks); //this is going to be public (not authenticated)

// get a single book
bookRouter.get("/:bookId", getSingleBook); //dynamic segment bookId to get a single book

// delete a book 
bookRouter.delete("/:bookId", authenticate, deleteBook); //deletion should be protected 




export default bookRouter;