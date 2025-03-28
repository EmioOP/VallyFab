import mongoose from 'mongoose'

export interface ISubCategory {
    name:string;
    category:mongoose.Types.ObjectId;
}


const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }
}, { timestamps: true })

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema)

export default SubCategory