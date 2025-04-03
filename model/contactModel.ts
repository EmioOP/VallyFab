import mongoose from 'mongoose'

export interface IContact {
    name: string;
    email: string;
    subject: string;
    content: string;
    isContactedByTeam:boolean;
}

const contactSchema = new mongoose.Schema<IContact>({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true 
    },
    subject:{
        type:String,
        required:true,
        maxlength:100
    },
    content:{
        type:String,
        required:true
    },
    //if contacted by our team member then the admin only can make it true
    isContactedByTeam:{
        type:Boolean,
        required:true,
        default:false
    }
}, { timestamps: true })

const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema)

export default Contact