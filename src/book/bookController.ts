import {Request, Response, NextFunction} from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import createHttpError from 'http-errors';
import bookModel from './bookModel';
import fs from 'node:fs';
import { isGeneratorObject } from 'node:util/types';
import { AuthRequest } from '../middlewares/authenticate';

const createBook = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const {title, genre} = req.body;

    const files = req.files as {[fieldname: string]: Express.Multer.File[] };

    //mimetype: 'image/jpeg' - will split this and take jpeg
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);  //first element of array is file info 

    const fileName = files.coverImage[0].filename;

    const filePath = path.resolve(__dirname,"../../public/data/uploads", fileName);


    //uploading cover image
    const uploadResult = await cloudinary.uploader.upload(filePath,{
        filename_override: __filename, 
        folder: 'book-covers',
        format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname,"../../public/data/uploads", bookFileName);

    //uploading pdf

    try {
        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
            resource_type: 'raw', 
            filename_override: bookFileName,
            folder: "book-pdfs",
            format: "pdf",
        });
    
    //     console.log("bookFileUploadResult", bookFileUploadResult);
    
    //     console.log("uploadResult", uploadResult);

    //    // @ts-ignore
    //     console.log("userId", req.userId);

        const _req = req as AuthRequest;

        const newBook = await bookModel.create({
            title,
            genre,
            author : _req.userId,
            coverImage : uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,

        })

        //deleting temporary files , wrap in try catch
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({id: newBook._id});
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Error while uploading book'))

    }
    
};

const updateBook = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const {title, genre } = req.body;
    const bookId = req.params.bookId;   //dynamic parameter 

    //check if book is present in DB or not
    const book = await bookModel.findOne({ _id: bookId});
    if(!book){
        return next(createHttpError(404,"Book not found"));
    }

    // check access (if author's id is same)

    const _req = req as AuthRequest;
    if(book.author.toString() != _req.userId){
        return next(createHttpError(403,"You cannot update other's book"))
    }

    // check if image field exists, if not then we keep the default image
    const files = req.files as {[fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if(files.coverImage){
        const filename = files.coverImage[0].filename;
        const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

        //send files to cloudinary
        const filepath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + filename
        );
        
        completeCoverImage =  filename;
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: coverMimeType,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filepath);  // delete local folder 
    }

    //check if file field exists 
    let completeFileName = "";
    if(files.file){
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + files.file[0].filename
        );

        const bookFileName = files.file[0].filename;
        completeFileName = bookFileName;

        const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: completeFileName,
            folder: "book-pdfs",
            format: 'pdf',
        });

        completeFileName = uploadResultPdf.secure_url;
        await fs.promises.unlink(bookFilePath);
    }

    //update db
    const updateBook = await bookModel.findOneAndUpdate(
        {
            _id: bookId,

        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage? completeCoverImage : book.coverImage,
            file: completeFileName? completeFileName : book.file,
        },
        {
            new: true
        }
    );

    res.json(updateBook);
};

const listBooks =async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        //todo: add pagination 
        const book = await bookModel.find();

        res.json(book)
    } catch (err) {
        return next(createHttpError(500,"Error while getting a book"));
    }
};

const getSingleBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;

    try {
        const book = await bookModel
            .findOne({ _id: bookId })
            // populate author field
            .populate("author", "name");
        if (!book) {
            return next(createHttpError(404, "Book not found."));
        }

        return res.json(book);
    } catch (err) {
        return next(createHttpError(500, "Error while getting a book"));
    }
};

const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;

    //check if book is available 
    const book = await bookModel.findOne({_id: bookId});

    if(!book){
        return next(createHttpError(404, "Book not found"));
    }

    //check if user is permitted to delete book 
    const _req = req as AuthRequest;
    if(book.author.toString() != _req.userId){
        return next(createHttpError(403,"You are not permitted to delete this book"))
    }

    // public id in cloudinary: book-covers/f306rbuzmnjn4v0pqvlm
    //mongo DB cover image url: https://res.cloudinary.com/dn6bopeje/image/upload/v1715554579/book-covers/vf7wjolaznipp0pcnh5u.jpg
    
    //public id will be made using last two elements of the split array
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
        coverFileSplits.at(-2) +
        "/" +
        coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
        bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
    console.log("bookFilePublicId", bookFilePublicId);
    // todo: add try error block

    try {
        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookFilePublicId, {
            resource_type: "raw",
        });
    } catch (error) {
        console.error("Error deleting files from Cloudinary:", error);
        return next(createHttpError(500, "Error deleting files from Cloudinary"));
    }

    await bookModel.deleteOne({ _id: bookId });

    return res.sendStatus(204);

};

export {createBook, updateBook, listBooks, getSingleBook, deleteBook};