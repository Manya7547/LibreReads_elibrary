import mongoose from 'mongoose'
import { userInfo } from 'node:os';
import { Book } from './bookType'

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        requred: true,
    },
    description: {
        type: String,
        require: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    genre: {
        type: String, 
        required: true,
    },
},
 {timestamps: true}
);

export default mongoose.model<Book>('Book', bookSchema);