import {Request, Response, NextFunction} from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import createHttpError from 'http-errors';

const createBook = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    
    console.log("files", req.files);

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
            folder: "books-pdfs",
            format: "pdf",
        });
    
        console.log("bookFileUploadResult", bookFileUploadResult);
    
        console.log("uploadResult", uploadResult);
    
        res.json({});

    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Error while uploading book'))

    }
    
};

export {createBook};