import mongoose from "mongoose"

export interface IBlog {
    _id:mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excert: string;
    content: string;
    author: string;
    image: string;
    category:string;

}

const blogSchema = new mongoose.Schema<IBlog>({
    title: {
        type: String,
        required: true,
        minlength: 8
    },
    slug: {
        type: String,
        required: true,
        minlength: 8
    },
    excert: {
        type: String,
        required: true,
        minlength: 8
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: "Vally"
    },
    image: {
        type: String,
        // required: true
    },
    category:{
        type:String,
    }
}, { timestamps: true })


const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)

export default Blog