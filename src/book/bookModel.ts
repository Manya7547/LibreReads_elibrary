import mongoose from 'mongoose'
import { Book } from './bookType'

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        requred: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
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