import mongoose from 'mongoose'

export interface ICart {
    owner: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
    amount: Number;
    createdAt: Date;
    UpdatedAt: Date;
}


const cartSchema = new mongoose.Schema<ICart>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {

        type: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "quantity cannot be less than 1"],
                    default: 1
                }

            },

        ], default: []
    },
    amount:{
        type:Number,

    }

}, { timestamps: true })


const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema)

export default Cart