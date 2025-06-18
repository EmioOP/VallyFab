import mongoose,{Schema} from "mongoose";
import "./productModel";

export interface IFeaturedProduct{
    _id?: mongoose.Types.ObjectId;
    productId:mongoose.Types.ObjectId;
    order:number;
    isActive:Boolean

}

const featuredProductSchema = new Schema<IFeaturedProduct>({
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true,
        unique:true
    },
    order:{
        type:Number,
        default:0,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})


const FeaturedProduct = mongoose.models.FeaturedProduct || mongoose.model<IFeaturedProduct>("FeaturedProduct",featuredProductSchema)

export default FeaturedProduct